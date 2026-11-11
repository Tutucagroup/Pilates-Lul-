import { NextResponse, type NextRequest } from "next/server";
import { REVIEW_BUCKET, supabaseAdmin } from "@/lib/supabase/server";
import { mediaKind, REVIEW_LIMITS } from "@/lib/reviews";

/** Devuelve una URL firmada para subir la foto/video directo a Supabase Storage (bucket privado). */
export async function POST(req: NextRequest) {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Reseñas no configuradas" }, { status: 503 });

  const { contentType, size } = (await req.json().catch(() => ({}))) as { contentType?: string; size?: number };
  const kind = mediaKind(String(contentType ?? ""));
  if (!kind) return NextResponse.json({ error: "Formato no permitido" }, { status: 400 });
  const max = kind === "image" ? REVIEW_LIMITS.imageMaxBytes : REVIEW_LIMITS.videoMaxBytes;
  if (!size || size > max) return NextResponse.json({ error: "Archivo demasiado grande" }, { status: 400 });

  const ext = String(contentType).split("/")[1].replace("quicktime", "mov").replace("jpeg", "jpg");
  const path = `pending/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await db.storage.from(REVIEW_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: "No se pudo preparar la subida" }, { status: 500 });
  return NextResponse.json({ path: data.path, token: data.token, kind });
}
