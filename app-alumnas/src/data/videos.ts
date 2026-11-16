/**
 * VIDEOS DE LAS 28 CLASES
 *
 * Pegá acá el enlace (o el ID) de YouTube de cada día. Ejemplos válidos:
 *   1: "https://youtu.be/AbCdEfGhIjK",
 *   2: "https://www.youtube.com/watch?v=AbCdEfGhIjK",
 *   3: "AbCdEfGhIjK",
 *
 * Mientras un día esté vacío (""), la clase muestra el cartel "Video en preparación".
 * Subí los videos a YouTube como "No listado" para que solo se vean desde la app.
 */
export const videos: Record<number, string> = {
  1: "", 2: "", 3: "", 4: "", 5: "", 6: "", 7: "",
  8: "", 9: "", 10: "", 11: "", 12: "", 13: "", 14: "",
  15: "", 16: "", 17: "", 18: "", 19: "", 20: "", 21: "",
  22: "", 23: "", 24: "", 25: "", 26: "", 27: "", 28: "",
};

/** Devuelve el ID de YouTube a partir de un enlace o un ID, o null si está vacío o no es válido. */
export function youtubeId(day: number): string | null {
  const raw = (videos[day] ?? "").trim();
  if (!raw) return null;
  const m = raw.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  if (m) return m[1];
  return /^[\w-]{11}$/.test(raw) ? raw : null;
}
