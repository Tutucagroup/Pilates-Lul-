/** Reglas compartidas por el formulario /opinion y la API. */
export const REVIEW_LIMITS = {
  imageMaxBytes: 10 * 1024 * 1024,
  videoMaxBytes: 100 * 1024 * 1024,
  imageTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
  videoTypes: ["video/mp4", "video/quicktime", "video/webm"],
  textMin: 20,
  textMax: 1200,
};

export const CONSENT_TEXT =
  "Autorizo a Pilates Lulú a publicar mi reseña, mi nombre, mi ciudad y la foto o el video que subo, en su sitio web y redes sociales. Puedo pedir que se retire en cualquier momento escribiendo por email.";

export function mediaKind(contentType: string): "image" | "video" | null {
  if (REVIEW_LIMITS.imageTypes.includes(contentType)) return "image";
  if (REVIEW_LIMITS.videoTypes.includes(contentType)) return "video";
  return null;
}
