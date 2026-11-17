import { NextResponse, type NextRequest } from "next/server";
import { brand } from "@/config/brand.config";
import { parsePayload, verifySignature, welcomeRecipient } from "@/lib/impultienda/webhook";
import { welcomeEmail } from "@/lib/impultienda/welcome-email";
import { sendWithResend } from "@/lib/impultienda/send-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (status: number, body: Record<string, unknown>) => NextResponse.json(body, { status });

/**
 * Webhook de Impultienda (Configuraciones → Webhooks, evento «Pago confirmado»).
 * Con cada compra del reto le manda a la compradora el mail de bienvenida.
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

  const to = welcomeRecipient(payload, {
    storeId: brand.impultienda.storeId,
    mainProductId: brand.impultienda.mainProductId,
  });
  if ("skip" in to) return json(200, { ok: false, reason: to.skip });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    console.error("impultienda webhook: falta RESEND_API_KEY o MAIL_FROM");
    return json(503, { ok: false, reason: "mail_not_configured" });
  }

  const mail = welcomeEmail({
    firstName: to.firstName,
    email: to.email,
    appUrl: brand.appUrl,
    logoUrl: `${brand.siteUrl}/email/logo.png`,
    test: payload.test === true,
  });

  const sent = await sendWithResend({
    apiKey,
    from,
    to: to.email,
    replyTo: process.env.MAIL_REPLY_TO || undefined,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    idempotencyKey: `impultienda-welcome-${payload.id}`,
  }).catch((e: unknown) => ({ ok: false as const, status: 0, error: e instanceof Error ? e.message : String(e) }));

  if (!sent.ok) {
    console.error("impultienda webhook: no se pudo enviar el mail", payload.data.order_number, sent.status, sent.error);
    return json(502, { ok: false, reason: "send_failed" });
  }
  return json(200, { ok: true, email_id: sent.id });
}
