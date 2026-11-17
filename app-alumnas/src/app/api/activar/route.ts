import { plans } from "@/data/program";
import { hasPlan, normalizeEmail } from "@/lib/entitlements";

export const runtime = "nodejs";

/**
 * Activa un plan adicional con el email de compra.
 * El webhook de la landing anota cada compra en Vercel Blob (ver src/lib/entitlements.ts);
 * acá solo se consulta si ese email compró ese plan.
 */

/** Intentos fallidos por IP y por hora. Barrera básica: vive en memoria y se reinicia con cada instancia. */
const FAIL_LIMIT = 15;
const fails = new Map<string, { hour: string; n: number }>();
const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export async function POST(req: Request) {
  const secret = process.env.ACTIVATION_SECRET;
  if (!secret || !process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  const hour = new Date().toISOString().slice(0, 13);
  const f = fails.get(ip);
  if (f?.hour === hour && f.n >= FAIL_LIMIT) return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let body: { email?: unknown; plan?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const email = normalizeEmail(String(body.email ?? "")).slice(0, 254);
  const plan = plans.find((p) => p.id === String(body.plan ?? "") && p.addon);
  if (!plan || !EMAIL.test(email)) return Response.json({ ok: false, error: "bad_request" }, { status: 400 });

  let found: boolean;
  try {
    found = await hasPlan(email, plan.id, secret);
  } catch (e) {
    console.error("activar: no se pudo consultar el almacenamiento", e);
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
  if (!found) {
    fails.set(ip, { hour, n: f?.hour === hour ? f.n + 1 : 1 });
    return Response.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  return Response.json({ ok: true, plan: plan.id, email });
}
