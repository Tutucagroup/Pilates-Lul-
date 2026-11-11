// Recomprime las imágenes de public/images (máx. 1080 px de ancho, WebP q72)
// y genera og.webp (1200×630) a partir de og-src.webp. Uso: npm run images:optimize
import sharp from "sharp";
import { readdir, rename, stat, unlink } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/images");
for (const f of await readdir(dir)) {
  if (!f.endsWith(".webp") || f === "og.webp") continue;
  const src = path.join(dir, f);
  if (f === "og-src.webp") {
    await sharp(src).resize(1200, 630, { fit: "cover", position: "right" }).webp({ quality: 78 }).toFile(path.join(dir, "og.webp"));
    console.log("og.webp creado");
    continue;
  }
  const before = (await stat(src)).size;
  const tmp = src + ".tmp";
  await sharp(src).resize({ width: 1080, withoutEnlargement: true }).webp({ quality: 72, effort: 6 }).toFile(tmp);
  await rename(tmp, src);
  const after = (await stat(src)).size;
  const meta = await sharp(src).metadata();
  console.log(`${f}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB (${meta.width}×${meta.height})`);
}
