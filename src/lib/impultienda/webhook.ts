import { createHmac, timingSafeEqual } from "node:crypto";

/** Tolerancia anti-replay: Impultienda recomienda rechazar timestamps de más de 5 minutos. */
export const MAX_SKEW_SECONDS = 300;

/**
 * Verifica la firma de un webhook de Impultienda.
 * X-Impultienda-Signature = HMAC-SHA256 (hex) de "{X-Impultienda-Timestamp}.{cuerpo crudo}".
 * Docs: https://impultienda.ar/docs/webhooks
 */
export function verifySignature(opts: {
  secret: string;
  rawBody: string;
  timestamp: string | null;
  signature: string | null;
  nowSeconds?: number;
}): "ok" | "stale" | "bad_signature" {
  const ts = Number(opts.timestamp);
  const now = opts.nowSeconds ?? Date.now() / 1000;
  if (!opts.timestamp || !Number.isFinite(ts) || Math.abs(now - ts) > MAX_SKEW_SECONDS) return "stale";

  const expected = createHmac("sha256", opts.secret).update(`${opts.timestamp}.${opts.rawBody}`).digest("hex");
  const given = (opts.signature ?? "").trim().toLowerCase();
  if (given.length !== expected.length) return "bad_signature";
  return timingSafeEqual(Buffer.from(given), Buffer.from(expected)) ? "ok" : "bad_signature";
}

export type WebhookPayload = {
  id: string;
  event: string;
  test?: boolean;
  data: {
    order_id: string;
    order_number?: number;
    status?: string;
    is_post_purchase?: boolean;
    customer?: { email?: string | null; name?: string | null; last_name?: string | null };
    items?: { product_id?: string; name?: string; type?: string }[];
    store?: { id?: string; subdomain?: string };
  };
};

/** Lee el JSON del aviso y se queda con lo que usamos. Devuelve null si no tiene la forma esperada. */
export function parsePayload(rawBody: string): WebhookPayload | null {
  let p: unknown;
  try {
    p = JSON.parse(rawBody);
  } catch {
    return null;
  }
  if (!p || typeof p !== "object") return null;
  const o = p as Record<string, unknown>;
  if (typeof o.id !== "string" || typeof o.event !== "string") return null;
  if (!o.data || typeof o.data !== "object") return null;
  return o as unknown as WebhookPayload;
}

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export type AccessConfig = {
  storeId: string;
  mainProductId: string;
  /** Upsells que habilitan un plan adicional en la app: producto de Impultienda → id del plan. */
  addons: { productId: string; planId: string }[];
};

export type OrderAccess = {
  email: string;
  firstName: string;
  /** La compra incluye el reto (producto principal): corresponde el mail de bienvenida. */
  main: boolean;
  /** Planes adicionales comprados en esta orden (order bump, upsell post-compra o link propio del upsell). */
  addonPlans: string[];
};

/**
 * Decide qué habilita esta venta y a quién se le avisa.
 * - Con el principal (con o sin order bump): se anota el reto (y el plan adicional si lo sumó) y, si hay proveedor de mails, sale la bienvenida.
 * - Solo un upsell (post-compra, que llega en un aviso aparte, o comprado con su link propio): se anota ese plan.
 */
export function orderAccess(p: WebhookPayload, cfg: AccessConfig): OrderAccess | { skip: string } {
  if (p.event !== "order.approved") return { skip: "event_not_handled" };
  if (p.data.store?.id && p.data.store.id !== cfg.storeId) return { skip: "other_store" };
  const ids = new Set((p.data.items ?? []).map((i) => i.product_id).filter(Boolean));
  const main = ids.has(cfg.mainProductId);
  const addonPlans = [...new Set(cfg.addons.filter((a) => a.productId && ids.has(a.productId)).map((a) => a.planId))];
  if (!main && !addonPlans.length) return { skip: "product_not_mapped" };
  const email = (p.data.customer?.email ?? "").trim();
  if (!EMAIL.test(email) || email.length > 254) return { skip: "no_email" };
  const firstName = (p.data.customer?.name ?? "").trim().split(/\s+/)[0]?.slice(0, 60) ?? "";
  return { email, firstName, main, addonPlans };
}
