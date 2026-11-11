import { NextResponse, type NextRequest } from "next/server";
import { funnel } from "@/config/funnel.config";
import { supabaseAdmin } from "@/lib/supabase/server";

const EVENTS = new Set(["view", "answer", "result", "checkout"]);
const STEP_IDS = new Set(funnel.steps.map((s) => s.id));
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Registra un evento del quiz (vista, respuesta, resultado, checkout) en Supabase. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 20_000) return new NextResponse(null, { status: 413 });

  let b: Record<string, unknown>;
  try {
    b = JSON.parse(raw);
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const sessionId = String(b.sessionId ?? "");
  const stepId = String(b.stepId ?? "");
  const event = String(b.event ?? "");
  if (!UUID.test(sessionId) || !STEP_IDS.has(stepId) || !EVENTS.has(event)) {
    return new NextResponse(null, { status: 400 });
  }

  const db = supabaseAdmin();
  if (!db) return new NextResponse(null, { status: 204 }); // Supabase sin configurar: no-op

  const obj = (v: unknown) => (v && typeof v === "object" && !Array.isArray(v) ? v : {});
  const { error } = await db.rpc("track_quiz_event", {
    p_session_id: sessionId,
    p_event: event,
    p_step_id: stepId,
    p_step_index: Number(b.stepIndex) || 0,
    p_step_name: String(b.stepName ?? "").slice(0, 120),
    p_variant: String(b.variant ?? "A").slice(0, 20),
    p_value: b.value ?? null,
    p_answers: obj(b.answers),
    p_attribution: obj(b.attribution),
    p_variants: obj(b.variants),
    p_user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
  });
  if (error) {
    console.error("track_quiz_event", error.message);
    return new NextResponse(null, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
}
