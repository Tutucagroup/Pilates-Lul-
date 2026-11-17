/** Envía un mail por la API de Resend (https://resend.com/docs/api-reference/emails/send-email). */
export async function sendWithResend(opts: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  /** Resend no repite un envío con la misma clave en 24 h: evita duplicados si Impultienda reintenta. */
  idempotencyKey: string;
}): Promise<{ ok: true; id: string } | { ok: false; status: number; error: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${opts.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": opts.idempotencyKey.slice(0, 256),
    },
    body: JSON.stringify({
      from: opts.from,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string; name?: string };
  if (res.ok && body.id) return { ok: true, id: body.id };
  return { ok: false, status: res.status, error: body.message || body.name || `HTTP ${res.status}` };
}
