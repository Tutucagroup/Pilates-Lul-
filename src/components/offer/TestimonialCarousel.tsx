import Image from "next/image";
import { withMedia } from "@/lib/testimonials";
import { formatDateEs } from "@/lib/format";
import { Stars } from "./Stars";

/** Carrusel de testimonios con foto o video. Lee data/testimonials.json. Vacío = no se muestra. */
export function TestimonialCarousel() {
  if (withMedia.length === 0) return null;
  return (
    <section aria-labelledby="testimonios" className="mt-12">
      <h2 id="testimonios" className="text-[22px] font-extrabold">Lo que cuentan las alumnas</h2>
      <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {withMedia.map((t) => (
          <figure key={t.id} className="w-[78%] shrink-0 snap-center overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
            {t.video ? (
              <video src={t.video} controls preload="none" playsInline poster={t.foto ?? undefined} className="aspect-[4/5] w-full bg-black object-cover" />
            ) : t.foto ? (
              <Image src={t.foto} alt={`Foto de ${t.nombre}`} width={480} height={600} sizes="80vw" className="aspect-[4/5] w-full object-cover" />
            ) : null}
            <figcaption className="p-4">
              <Stars value={t.estrellas} />
              <blockquote className="mt-2 text-[15px]">“{t.texto}”</blockquote>
              <p className="mt-2 text-[14px] font-bold">
                {t.nombre} · <span className="font-normal text-muted">{t.ciudad} · {formatDateEs(t.fecha)}</span>
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
