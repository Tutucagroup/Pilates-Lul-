// Publica las reseñas APROBADAS de Supabase en data/testimonials.json
// y copia sus fotos/videos a public/testimonials/.
//
// Flujo: alumna envía en /opinion → queda "pending" → vos la aprobás en Supabase
// (status = 'approved') → corrés `npm run testimonials:sync` → commit + deploy.
//
// Requiere .env.local con NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false } });

const { data, error } = await db
  .from("reviews")
  .select("id, created_at, approved_at, name, city, text, rating, media_path, media_type, consent")
  .eq("status", "approved")
  .eq("consent", true)
  .order("created_at", { ascending: false });
if (error) throw error;

const outDir = path.resolve("public/testimonials");
await mkdir(outDir, { recursive: true });

const out = [];
for (const r of data) {
  let foto = null;
  let video = null;
  if (r.media_path) {
    const { data: blob, error: dlErr } = await db.storage.from("review-media").download(r.media_path);
    if (dlErr) {
      console.warn(`No se pudo bajar ${r.media_path}: ${dlErr.message}`);
    } else {
      const ext = path.extname(r.media_path) || (r.media_type === "video" ? ".mp4" : ".jpg");
      const file = `${r.id}${ext}`;
      await writeFile(path.join(outDir, file), Buffer.from(await blob.arrayBuffer()));
      if (r.media_type === "video") video = `/testimonials/${file}`;
      else foto = `/testimonials/${file}`;
    }
  }
  out.push({
    id: r.id,
    nombre: r.name,
    ciudad: r.city,
    texto: r.text,
    estrellas: r.rating,
    foto,
    video,
    fecha: r.created_at.slice(0, 10),
    consentimiento: true,
  });
}

await writeFile(path.resolve("data/testimonials.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`${out.length} reseñas aprobadas escritas en data/testimonials.json`);
