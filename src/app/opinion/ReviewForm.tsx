"use client";
import { useState } from "react";
import { CONSENT_TEXT, mediaKind, REVIEW_LIMITS } from "@/lib/reviews";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "uploading" | "sending" | "done" | "error";

const input =
  "mt-1 block min-h-12 w-full rounded-2xl border-2 border-brand/25 bg-white px-4 py-3 text-[17px] outline-none focus:border-brand";

export function ReviewForm() {
  const [rating, setRating] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  const pickFile = (f: File | null) => {
    setError(null);
    if (!f) return setFile(null);
    const kind = mediaKind(f.type);
    if (!kind) return setError("Formato no permitido. Subí una foto (JPG, PNG, WEBP, HEIC) o un video (MP4, MOV).");
    const max = kind === "image" ? REVIEW_LIMITS.imageMaxBytes : REVIEW_LIMITS.videoMaxBytes;
    if (f.size > max) return setError(`El archivo es muy pesado (máximo ${Math.round(max / 1024 / 1024)} MB).`);
    setFile(f);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    if (!rating) return setError("Elegí una puntuación de 1 a 5 estrellas.");
    if (!consent) return setError("Necesitamos tu autorización para publicar la reseña.");

    let mediaPath: string | null = null;
    let mediaType: "image" | "video" | null = null;
    try {
      if (file) {
        setStatus("uploading");
        setProgress("Subiendo tu archivo…");
        const r = await fetch("/api/reviews/upload-url", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ contentType: file.type, size: file.size }),
        });
        const up = await r.json();
        if (!r.ok) throw new Error(up.error ?? "No pudimos preparar la subida");
        const { createClient } = await import("@supabase/supabase-js");
        const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        const { error: upErr } = await sb.storage.from("review-media").uploadToSignedUrl(up.path, up.token, file, {
          contentType: file.type,
        });
        if (upErr) throw new Error("No pudimos subir el archivo. Probá de nuevo.");
        mediaPath = up.path;
        mediaType = up.kind;
      }
      setStatus("sending");
      setProgress("Enviando tu reseña…");
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          city: fd.get("city"),
          text: fd.get("text"),
          website: fd.get("website"),
          rating,
          consent,
          mediaPath,
          mediaType,
        }),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error ?? "No pudimos guardar tu reseña");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Algo salió mal. Probá de nuevo.");
    } finally {
      setProgress(null);
    }
  }

  if (status === "done") {
    return (
      <div className="mt-8 rounded-3xl bg-white p-6 text-center ring-1 ring-black/5" role="status">
        <p className="text-4xl" aria-hidden="true">💛</p>
        <h2 className="mt-2 text-[22px] font-extrabold">¡Gracias por tu reseña!</h2>
        <p className="mt-2 text-[16px] text-muted">La vamos a revisar y, si está todo bien, la publicamos en los próximos días.</p>
      </div>
    );
  }

  const busy = status === "uploading" || status === "sending";
  return (
    <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
      <fieldset>
        <legend className="text-[16px] font-bold">Tu puntuación</legend>
        <div className="mt-2 flex gap-1" role="radiogroup" aria-label="Puntuación">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
              onClick={() => setRating(n)}
              className="flex h-12 w-12 items-center justify-center rounded-xl text-3xl"
            >
              <span className={n <= rating ? "text-amber-500" : "text-black/15"}>★</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-[16px] font-bold">Tu nombre</span>
        <input name="name" required minLength={2} maxLength={60} autoComplete="given-name" className={input} placeholder="Como querés que aparezca" />
      </label>
      <label className="block">
        <span className="text-[16px] font-bold">Ciudad</span>
        <input name="city" required minLength={2} maxLength={60} autoComplete="address-level2" className={input} />
      </label>
      <label className="block">
        <span className="text-[16px] font-bold">Tu experiencia</span>
        <textarea
          name="text"
          required
          minLength={REVIEW_LIMITS.textMin}
          maxLength={REVIEW_LIMITS.textMax}
          rows={5}
          className={input}
          placeholder="¿Qué te gustó? ¿Cómo te sentiste durante el reto?"
        />
      </label>

      {/* Honeypot anti-bots: invisible para personas */}
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label className="block">
        <span className="text-[16px] font-bold">Foto o video (opcional)</span>
        <input
          type="file"
          accept={[...REVIEW_LIMITS.imageTypes, ...REVIEW_LIMITS.videoTypes].join(",")}
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full rounded-2xl border-2 border-dashed border-brand/30 bg-white p-4 text-[15px] file:mr-3 file:min-h-10 file:rounded-xl file:border-0 file:bg-brand-soft file:px-3 file:font-bold file:text-brand-dark"
        />
        <span className="mt-1 block text-[13px] text-muted">Foto hasta 10 MB · video hasta 100 MB.</span>
      </label>

      <label className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/10">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-6 w-6 shrink-0 accent-[var(--color-brand)]" required />
        <span className="text-[14px] leading-snug">{CONSENT_TEXT}</span>
      </label>

      {error ? <p className="text-[15px] text-red-700" role="alert">{error}</p> : null}
      {progress ? <p className="text-[15px] text-muted" role="status">{progress}</p> : null}

      <Button type="submit" disabled={busy}>
        {busy ? "Enviando…" : "Enviar mi reseña"}
      </Button>
    </form>
  );
}
