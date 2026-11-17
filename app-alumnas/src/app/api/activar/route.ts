import { plans } from "@/data/program";
import { checkActivationCode, normalizeEmail } from "@/lib/activation";

export const runtime = "nodejs";

/**
 * Verifica el código de activación de un plan adicional.
 * El código lo calcula el webhook de la landing con el mismo ACTIVATION_SECRET (ver src/lib/activation.ts).
 */

/** Intentos fallidos por IP y por hora. Barrera básica: vive en memoria y se reinicia con cada instancia. */
const FAIL_LIMIT = 15;
const fails = new Map<string, { hour: string; n: number }>();
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export async function POST(req: Request) {
  const secret = process.env.ACTIVATION_SECRET;
  if (!secret) return Response.json({ ok: false, error: "not_configured" }, { status: 503 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const hour = new Date().toISOString().slice(0, 13);
  const f = fails.get(ip);
  if (f?.hour === hour && f.n >= FAIL_LIMIT) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { email?: unknown; code?: unknown; plan?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const email = normalizeEmail(String(body.email ?? "")).slice(0, 254);
  const code = String(body.code ?? "").slice(0, 40);
  const planId = String(body.plan ?? "");
  const plan = plans.find((p) => p.id === planId && p.addon);
  if (!plan || !EMAIL.test(email) || !code) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });

  if (!checkActivationCode(email, plan.id, code, secret)) {
    fails.set(ip, { hour, n: f?.hour === hour ? f.n + 1 : 1 });
    return Response.json({ ok: false, error: "invalid_code" }, { status: 401 });
  }
  return Response.json({ ok: true, plan: plan.id, email });
}
