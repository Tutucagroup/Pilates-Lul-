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
      <ul className="mt-4 grid items-start gap-4 sm:grid-cols-2">
        {chats.map((c) => (
          <li key={c.src} className="overflow-hidden rounded-3xl bg-ink shadow-lg shadow-black/10 ring-1 ring-black/5">
            <Image src={c.src} alt={c.alt} width={c.width} height={c.height} sizes="(max-width: 640px) 100vw, 360px" className="h-auto w-full" />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[13px] text-muted">
        Mensajes de alumnas de ediciones anteriores del reto. Los resultados varían de una persona a otra.
      </p>
    </section>
  );
}
