import { NextResponse, type NextRequest } from "next/server";
import { brand } from "@/config/brand.config";
import { grantPlans } from "@/lib/entitlements";
import { orderAccess, parsePayload, verifySignature } from "@/lib/impultienda/webhook";
import { addonEmail, welcomeEmail, type Activation } from "@/lib/impultienda/welcome-email";
import { sendWithResend } from "@/lib/impultienda/send-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/**
 * Webhook de Impultienda (Configuraciones → Webhooks, evento «Pago confirmado»).
 * 1. Anota qué planes compró la alumna (Vercel Blob, ver src/lib/entitlements.ts). Con eso, en la app de
 *    alumnas activa el plan adicional escribiendo su email de compra.
 * 2. Si hay un proveedor de mails configurado (RESEND_API_KEY y MAIL_FROM), además le manda el mail de
 *    bienvenida (o, si compró solo el upsell, uno corto para activarlo). Sin proveedor, ese paso se saltea.
 *
 * Códigos de respuesta (Impultienda reintenta todo lo que no sea 2xx, salvo 4xx):
 * - 200: procesado, o ignorado a propósito (otro evento, otra tienda, otro producto).
 * - 401: firma inválida o vieja. 400: cuerpo ilegible. Los dos cortan los reintentos.
 * - 503 / 502: falta configurar el almacenamiento o falló al guardar o al mandar el mail. Impultienda
 *   reintenta durante ~32 h, así que las ventas de ese rato se procesan cuando se arregla.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.IMPULTIENDA_WEBHOOK_SECRET;
  if (!secret) {
    console.error("impultienda webhook: falta IMPULTIENDA_WEBHOOK_SECRET");
    return json(503, { ok: false, reason: "not_configured" });
  }

  const raw = await req.text();
  if (raw.length > 200_000) return json(413, { ok: false, reason: "too_large" });

  const sig = verifySignature({
    secret,
    rawBody: raw,
    timestamp: req.headers.get("x-impultienda-timestamp"),
    signature: req.headers.get("x-impultienda-signature"),
  });
  if (sig !== "ok") return json(401, { ok: false, reason: sig });

  const payload = parsePayload(raw);
  if (!payload) return json(400, { ok: false, reason: "bad_payload" });

  const upsell = brand.upsell;
  const to = orderAccess(payload, {
    storeId: brand.impultienda.storeId,
    mainProductId: brand.impultienda.mainProductId,
    addons: upsell.productId ? [{ productId: upsell.productId, planId: upsell.planId }] : [],
  });
  if ("skip" in to) return json(200, { ok: false, reason: to.skip });

  // 1 · Guardar la compra. Para el plan adicional es obligatorio (sin esto no se puede activar).
  const plans = [...(to.main ? [brand.program.appPlanId] : []), ...to.addonPlans];
  const storeSecret = process.env.ACTIVATION_SECRET;
  const storeReady = !!storeSecret && !!process.env.BLOB_READ_WRITE_TOKEN;
  if (!storeReady) {
    console.error("impultienda webhook: falta ACTIVATION_SECRET o BLOB_READ_WRITE_TOKEN");
    if (to.addonPlans.length) return json(503, { ok: false, reason: "store_not_configured" });
  } else {
    try {
      await grantPlans(to.email, plans, storeSecret!);
    } catch (e) {
      console.error("impultienda webhook: no se pudo guardar la compra", payload.data.order_number, e);
      if (to.addonPlans.length) return json(502, { ok: false, reason: "store_failed" });
    }
  }

  // 2 · Mail propio (opcional).
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) return json(200, { ok: true, plans, mail: "not_configured" });

  const activations: Activation[] = to.addonPlans.map((planId) => ({
    planName: planId === upsell.planId ? upsell.name : planId,
    url: `${brand.appUrl}/activar#${new URLSearchParams({ plan: planId, email: to.email }).toString()}`,
  }));

  const common = {
    firstName: to.firstName,
    email: to.email,
    appUrl: brand.appUrl,
    logoUrl: `${brand.siteUrl}/email/logo.png`,
    test: payload.test === true,
  };
  const mail = to.main ? welcomeEmail({ ...common, activations }) : addonEmail({ ...common, activations });
  const kind = to.main ? "welcome" : "addon";

  const sent = await sendWithResend({
    apiKey,
    from,
    to: to.email,
    replyTo: process.env.MAIL_REPLY_TO || undefined,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    idempotencyKey: `impultienda-${kind}-${payload.id}`,
  }).catch((e: unknown) => ({ ok: false as const, status: 0, error: e instanceof Error ? e.message : String(e) }));

  if (!sent.ok) {
    console.error("impultienda webhook: no se pudo enviar el mail", payload.data.order_number, sent.status, sent.error);
    return json(502, { ok: false, reason: "send_failed" });
  }
  return json(200, { ok: true, plans, email_id: sent.id });
}
