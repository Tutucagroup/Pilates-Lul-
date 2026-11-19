"use client";
import Image from "next/image";
import { brand } from "@/config/brand.config";
import { funnel } from "@/config/funnel.config";
import type { PlanSummary } from "@/lib/rules/summary";
import { BuyButton } from "./BuyButton";
import { Faq } from "./Faq";
import { PriceBox } from "./PriceBox";
import { ReviewList } from "./ReviewList";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { Urgency } from "./Urgency";

type BuyProps = {
  summary: PlanSummary;
  stepId: string;
  stepIndex: number;
  stepName: string;
  position: "top" | "bottom";
  label: string;
};

/** Los 2 programas que incluye la compra, con su cantidad de clases. */
function IncludedPrograms() {
  const { program, includedProgram: extra } = brand;
  const items = [
    { name: `${program.name} de ${brand.method}`, detail: `${program.days} clases · 1 por día` },
    { name: extra.name, detail: `${extra.classes} clases · ${extra.perWeek} por semana` },
  ];
  return (
    <div className="mt-4 rounded-3xl bg-brand-soft p-4">
      <p className="text-center text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand">
        Incluye los 2 programas
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((it) => (
          <li key={it.name} className="flex items-start gap-3">
            <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-price text-[13px] font-bold text-white">✓</span>
            <span>
              <span className="block font-bold leading-snug">{it.name}</span>
              <span className="block text-[14px] text-muted">{it.detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Precio (los 2 programas) + botón que lleva directo al checkout de Impultienda. */
export function BuyBlock({ summary, stepId, stepIndex, stepName, position, label }: BuyProps) {
  return (
    <>
      {position === "top" ? <Urgency /> : null}
      <PriceBox />
      <IncludedPrograms />
      <div className="mt-4">
        <BuyButton label={label} level={summary.level} stepId={stepId} stepIndex={stepIndex} stepName={stepName} position={position} />
      </div>
      <p className="mt-2 text-center text-[14px] text-muted">{funnel.offer.checkoutNote}</p>
    </>
  );
}

type Props = { summary: PlanSummary; hydrated: boolean; stepId: string; stepIndex: number; stepName: string };

/**
 * Explicación de venta que va debajo del resultado: beneficios, cómo funciona, qué incluye,
 * testimonios, bonos, FAQ, segundo botón y garantía. Todo sale de funnel.config.ts (offer).
 */
export function OfferDetails({ summary, hydrated, stepId, stepIndex, stepName }: Props) {
  const o = funnel.offer;
  // Antes de rehidratar mostramos la versión genérica (sin respuestas) para no parpadear datos.
  const benefits = (hydrated ? summary.benefitIds : o.benefits.map((b) => b.id))
    .map((id) => o.benefits.find((b) => b.id === id)!)
    .slice(0, 4);

  return (
    <div className="pb-6">
      {/* Beneficios ordenados según sus respuestas */}
      <section aria-labelledby="beneficios" className="mt-10">
        <h2 id="beneficios" className="text-[22px] font-extrabold">{o.benefitsTitle}</h2>
        <ul className="mt-4 grid gap-3">
          {benefits.map((b) => (
            <li key={b.id} className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
              <p className="font-bold">{b.title}</p>
              <p className="mt-1 text-[15px] text-muted">{b.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Cómo funciona */}
      <section aria-labelledby="como" className="mt-10">
        <h2 id="como" className="text-[22px] font-extrabold">Cómo funciona</h2>
        <ol className="mt-4 space-y-4">
          {o.howItWorks.map((h, i) => (
            <li key={h.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-[16px] font-extrabold text-white">{i + 1}</span>
              <div>
                <p className="font-bold">{h.title}</p>
                <p className="text-[15px] text-muted">{h.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Qué incluye */}
      <section aria-labelledby="incluye" className="mt-10">
        <h2 id="incluye" className="text-[22px] font-extrabold">Qué incluye</h2>
        <ul className="mt-4 space-y-3">
          {o.includes.map((item) => (
            <li key={item} className="flex gap-3 text-[16px]">
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-price/15 text-[13px] font-bold text-price">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Mockup del producto */}
      <div className="mt-10 overflow-hidden rounded-3xl">
        <Image
          src="/images/mockup.webp"
          alt={`Vista del ${brand.program.name} en el celular`}
          width={896}
          height={1120}
          sizes="(max-width: 448px) 100vw, 448px"
          className="h-auto w-full"
        />
      </div>

      {/* Testimonios y reseñas reales (si hay) */}
      <TestimonialCarousel />
      <ReviewList />

      {/* Bonos */}
      {o.bonuses.length ? (
        <section aria-labelledby="bonos" className="mt-12">
          <h2 id="bonos" className="text-[22px] font-extrabold">Bonos incluidos</h2>
          <ul className="mt-4 grid gap-3">
            {o.bonuses.map((b) => (
              <li key={b.title} className="flex gap-3 rounded-2xl bg-brand-soft p-4">
                <span aria-hidden="true" className="text-2xl">🎁</span>
                <div>
                  <p className="font-bold">{b.title}</p>
                  <p className="text-[15px] text-muted">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Faq items={o.faq} />

      {/* Segundo botón */}
      <section aria-label="Comprar" className="mt-10">
        <BuyBlock summary={summary} stepId={stepId} stepIndex={stepIndex} stepName={stepName} position="bottom" label={o.ctaSecondary} />
      </section>

      {/* Garantía */}
      <section aria-labelledby="garantia" className="mt-10 flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-black/5">
        <span aria-hidden="true" className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-full border-4 border-price text-price">
          <span className="text-xl font-extrabold leading-none">{brand.guarantee.days}</span>
          <span className="text-[10px] font-bold uppercase">días</span>
        </span>
        <div>
          <h2 id="garantia" className="text-[18px] font-extrabold">Garantía de {brand.guarantee.days} días</h2>
          <p className="mt-1 text-[15px] text-muted">{o.guaranteeText(brand.guarantee.days)}</p>
        </div>
      </section>

      <footer className="mt-10 text-center text-[13px] text-muted">
        <p>
          {brand.name}
          {brand.supportEmail ? ` · ${brand.supportEmail}` : null}
        </p>
        <p className="mt-1">
          Este programa no reemplaza la consulta con un profesional de la salud. Las imágenes son ilustrativas.
        </p>
      </footer>
    </div>
  );
}
