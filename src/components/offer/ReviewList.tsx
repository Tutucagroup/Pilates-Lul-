import { ratingStats, testimonials } from "@/lib/testimonials";
import { decimalEs, formatDateEs } from "@/lib/format";
import { Stars } from "./Stars";

/** Reseñas con estrellas. Promedio y cantidad se calculan de los datos reales. Vacío = no se muestra. */
export function ReviewList({ limit = 6 }: { limit?: number }) {
  const stats = ratingStats(testimonials);
  if (!stats) return null;
  const list = [...testimonials].sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, limit);
  return (
    <section aria-labelledby="resenas" className="mt-12">
      <h2 id="resenas" className="text-[22px] font-extrabold">Reseñas</h2>
      <p className="mt-1 flex items-center gap-2 text-[15px] text-muted">
        <Stars value={stats.average} /> {decimalEs(stats.average)} de 5 · {stats.count} {stats.count === 1 ? "reseña" : "reseñas"}
      </p>
      <ul className="mt-4 space-y-3">
        {list.map((t) => (
          <li key={t.id} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <Stars value={t.estrellas} size={16} />
              <span className="text-[13px] text-muted">{formatDateEs(t.fecha)}</span>
            </div>
            <p className="mt-2 text-[15px]">{t.texto}</p>
            <p className="mt-2 text-[14px] font-bold">
              {t.nombre} <span className="font-normal text-muted">· {t.ciudad}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
