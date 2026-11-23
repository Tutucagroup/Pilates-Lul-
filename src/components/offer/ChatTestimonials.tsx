"use client";
import Image from "next/image";
import { useRef, useState } from "react";

/**
 * Capturas de mensajes de alumnas (WhatsApp), en carrusel: una por vez, entera, sin recortes en pantalla.
 * Las imágenes están en public/images/testimonios/, recortadas a la parte del mensaje para que
 * el texto se lea bien en el celular. Para sumar una: agregá el .webp y una entrada acá con su
 * ancho y alto reales. Usá solo capturas originales de alumnas reales que hayan dado su permiso.
 */
const chats = [
  {
    src: "/images/testimonios/mensaje-dia-12.webp",
    alt: "Mensaje de una alumna: «Profe, voy por el día 12 del reto y ya he bajado 2 kg y me siento muchísimo más liviana y ágil. ¡Gracias!»",
    width: 800,
    height: 459,
  },
  {
    src: "/images/testimonios/mensaje-dia-5.webp",
    alt: "Mensaje de una alumna: «Lulú, me encanta el reto. Recién arranco, voy 5 días pero me tiene motivada. Antes no hacía nada de ejercicio y ahora con el seguimiento y las clases diarias pude hacerme una rutina.»",
    width: 800,
    height: 745,
  },
];

export function ChatTestimonials({ className = "mt-12" }: { className?: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  if (chats.length === 0) return null;

  const onScroll = () => {
    const el = track.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => track.current?.scrollTo({ left: i * track.current.clientWidth, behavior: "smooth" });

  return (
    <section aria-labelledby="mensajes-alumnas" className={className}>
      <h2 id="mensajes-alumnas" className="text-[22px] font-extrabold">Lo que nos escriben las alumnas</h2>
      <ul ref={track} onScroll={onScroll} className="no-scrollbar mt-4 flex snap-x snap-mandatory items-start overflow-x-auto">
        {chats.map((c) => (
          <li key={c.src} className="flex w-full shrink-0 snap-center justify-center px-1">
            <Image
              src={c.src}
              alt={c.alt}
              width={c.width}
              height={c.height}
              sizes="320px"
              className="h-auto w-full max-w-[320px] rounded-2xl shadow-md shadow-black/10 ring-1 ring-black/5"
            />
          </li>
        ))}
      </ul>
      {chats.length > 1 ? (
        <div className="mt-3 flex justify-center gap-2">
          {chats.map((c, i) => (
            <button
              key={c.src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver mensaje ${i + 1} de ${chats.length}`}
              aria-current={i === active}
              className={`h-2.5 rounded-full transition-all ${i === active ? "w-6 bg-brand" : "w-2.5 bg-brand/30"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
