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

/**
 * Decide si a esta venta le corresponde el mail de bienvenida y a quién va.
 * Solo pagos confirmados de esta tienda que incluyan el producto principal (no upsells post-compra).
 */
export function welcomeRecipient(
  p: WebhookPayload,
  cfg: { storeId: string; mainProductId: string },
): { email: string; firstName: string } | { skip: string } {
  if (p.event !== "order.approved") return { skip: "event_not_handled" };
  if (p.data.store?.id && p.data.store.id !== cfg.storeId) return { skip: "other_store" };
  if (p.data.is_post_purchase) return { skip: "post_purchase" };
  const items = p.data.items ?? [];
  if (!items.some((i) => i.product_id === cfg.mainProductId)) return { skip: "product_not_mapped" };
  const email = (p.data.customer?.email ?? "").trim();
  if (!EMAIL.test(email) || email.length > 254) return { skip: "no_email" };
  const firstName = (p.data.customer?.name ?? "").trim().split(/\s+/)[0]?.slice(0, 60) ?? "";
  return { email, firstName };
}
