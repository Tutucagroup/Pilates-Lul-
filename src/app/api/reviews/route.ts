import { NextResponse, type NextRequest } from "next/server";
import { REVIEW_BUCKET, supabaseAdmin } from "@/lib/supabase/server";
import { CONSENT_TEXT, REVIEW_LIMITS } from "@/lib/reviews";

/** Guarda una reseña como PENDIENTE. Nada se publica hasta que la apruebes. */
export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Reseñas no configuradas" }, { status: 503 });

  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: bot

  const name = String(b.name ?? "").trim();
  const city = String(b.city ?? "").trim();
  const text = String(b.text ?? "").trim();
  const rating = Number(b.rating);
  const consent = b.consent === true;
  const mediaPath = typeof b.mediaPath === "string" && b.mediaPath.startsWith("pending/") ? b.mediaPath : null;
  const mediaType = b.mediaType === "image" || b.mediaType === "video" ? b.mediaType : null;

  const errors: string[] = [];
  if (name.length < 2 || name.length > 60) errors.push("Nombre");
  if (city.length < 2 || city.length > 60) errors.push("Ciudad");
  if (text.length < REVIEW_LIMITS.textMin || text.length > REVIEW_LIMITS.textMax) errors.push("Reseña");
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.push("Puntuación");
  if (!consent) errors.push("Consentimiento");
  if (errors.length) return NextResponse.json({ error: `Revisá: ${errors.join(", ")}` }, { status: 400 });

  if (mediaPath) {
    const folder = mediaPath.split("/").slice(0, -1).join("/");
    const file = mediaPath.split("/").pop()!;
    const { data } = await db.storage.from(REVIEW_BUCKET).list(folder, { search: file });
    if (!data?.some((f) => f.name === file)) {
      return NextResponse.json({ error: "No encontramos el archivo subido" }, { status: 400 });
    }
  }

  const { error } = await db.from("reviews").insert({
    name,
    city,
    text,
    rating,
    consent: true,
    consent_text: CONSENT_TEXT,
    media_path: mediaPath,
    media_type: mediaPath ? mediaType : null,
  });
  if (error) {
    console.error("reviews insert", error.message);
    return NextResponse.json({ error: "No pudimos guardar tu reseña" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
