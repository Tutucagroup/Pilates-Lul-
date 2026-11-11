/**
 * Testimonios y reseñas REALES. Fuente: data/testimonials.json
 * (lo genera `npm run testimonials:sync` desde Supabase con las reseñas aprobadas).
 * Solo se muestran entradas con consentimiento: true. Si el archivo está vacío,
 * las secciones no se renderizan.
 */
import raw from "../../data/testimonials.json";

export type Testimonial = {
  id: string;
  nombre: string;
  ciudad: string;
  texto: string;
  estrellas: number;
  foto?: string | null;
  video?: string | null;
  fecha: string; // yyyy-mm-dd
  consentimiento: boolean;
};

function valid(t: Partial<Testimonial>): t is Testimonial {
  return (
    t.consentimiento === true &&
    typeof t.id === "string" &&
    typeof t.nombre === "string" && t.nombre.trim().length > 0 &&
    typeof t.ciudad === "string" &&
    typeof t.texto === "string" && t.texto.trim().length > 0 &&
    typeof t.fecha === "string" &&
    Number.isInteger(t.estrellas) && (t.estrellas as number) >= 1 && (t.estrellas as number) <= 5
  );
}

export const testimonials: Testimonial[] = (raw as Partial<Testimonial>[]).filter(valid);
export const withMedia = testimonials.filter((t) => t.foto || t.video);

export function ratingStats(list: Testimonial[]) {
  if (!list.length) return null;
  const avg = list.reduce((a, t) => a + t.estrellas, 0) / list.length;
  return { average: Math.round(avg * 10) / 10, count: list.length };
}
