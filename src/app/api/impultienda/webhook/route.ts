import { NextResponse, type NextRequest } from "next/server";
import { brand } from "@/config/brand.config";
import { activationCode } from "@/lib/activation";
import { orderAccess, parsePayload, verifySignature } from "@/lib/impultienda/webhook";
import { addonEmail, welcomeEmail, type Activation } from "@/lib/impultienda/welcome-email";
import { sendWithResend } from "@/lib/impultienda/send-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/**
 * Webhook de Impultienda (Configuraciones → Webhooks, evento «Pago confirmado»).
 * - Compra del reto (con o sin el order bump): mail de bienvenida. Si sumó el upsell, el mail trae
 *   el código para activar ese plan en la app de alumnas.
 * - Compra solo del upsell (post-compra o con su link propio): mail con el código de activación.
 *
 * Códigos de respuesta (Impultienda reintenta todo lo que no sea 2xx, salvo 4xx):
 * - 200: procesado, o ignorado a propósito (otro evento, otra tienda, otro producto).
 * - 401: firma inválida o vieja. 400: cuerpo ilegible. Los dos cortan los reintentos.
 * - 503 / 502: falta configurar algo o falló el envío. Impultienda reintenta durante ~32 h,
 *   así que las ventas que entren antes de terminar la configuración igual reciben su mail.
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

  const activationSecret = process.env.ACTIVATION_SECRET;
  if (to.addonPlans.length && !activationSecret) {
    console.error("impultienda webhook: falta ACTIVATION_SECRET para el plan adicional");
    return json(503, { ok: false, reason: "activation_not_configured" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    console.error("impultienda webhook: falta RESEND_API_KEY o MAIL_FROM");
    return json(503, { ok: false, reason: "mail_not_configured" });
  }

  const activations: Activation[] = to.addonPlans.map((planId) => {
    const code = activationCode(to.email, planId, activationSecret!);
    const hash = new URLSearchParams({ plan: planId, email: to.email, codigo: code }).toString();
    return { planName: planId === upsell.planId ? upsell.name : planId, code, url: `${brand.appUrl}/activar#${hash}` };
  });

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
  return json(200, { ok: true, email_id: sent.id });
}
