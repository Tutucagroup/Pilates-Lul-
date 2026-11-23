import Image from "next/image";

/**
 * Capturas de mensajes de alumnas (WhatsApp). Las imágenes están en public/images/testimonios/.
 * Para sumar una: agregá el archivo .webp y una entrada acá con su ancho y alto reales.
 * Usá solo capturas originales de alumnas reales que hayan dado su permiso.
 */
const chats = [
  {
    src: "/images/testimonios/chat-reto-dia-12.webp",
    alt: "Mensaje de una alumna: «Profe, voy por el día 12 del reto y ya he bajado 2 kg y me siento muchísimo más liviana y ágil. ¡Gracias!»",
    width: 720,
    height: 1328,
  },
  {
    src: "/images/testimonios/chat-reto-dia-5.webp",
    alt: "Mensaje de una alumna: «Lulú, me encanta el reto. Recién arranco, voy 5 días pero me tiene motivada. Antes no hacía nada de ejercicio y ahora con el seguimiento y las clases diarias pude hacerme una rutina.»",
    width: 720,
    height: 702,
  },
];

export function ChatTestimonials({ className = "mt-12" }: { className?: string }) {
  if (chats.length === 0) return null;
  return (
    <section aria-labelledby="mensajes-alumnas" className={className}>
      <h2 id="mensajes-alumnas" className="text-[22px] font-extrabold">Lo que nos escriben las alumnas</h2>
      {/* Carrusel: se desliza con el dedo; la tarjeta siguiente asoma para que se note. */}
      <ul className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:justify-center">
        {chats.map((c) => (
          <li
            key={c.src}
            className="w-[58%] max-w-[240px] shrink-0 snap-center overflow-hidden rounded-2xl bg-[#0b0f0e] shadow-md shadow-black/10 ring-1 ring-black/5"
          >
            <Image src={c.src} alt={c.alt} width={c.width} height={c.height} sizes="240px" className="h-auto w-full" />
          </li>
        ))}
      </ul>
    </section>
  );
}
