import type { Faq as FaqItem } from "@/funnel/types";

/** Preguntas frecuentes en acordeón (details/summary: accesible y sin JS). */
export function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="faq" className="mt-12">
      <h2 id="faq" className="text-[22px] font-extrabold">Preguntas frecuentes</h2>
      <div className="mt-4 divide-y divide-black/5 rounded-3xl bg-white ring-1 ring-black/5">
        {items.map((f) => (
          <details key={f.q} className="group px-5">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 text-[16px] font-bold [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden="true" className="text-xl text-brand transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="pb-4 text-[15px] text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
