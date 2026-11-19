"use client";
import { useEffect, useState } from "react";
import { price } from "@/lib/pricing";
import { BuyButton } from "../offer/BuyButton";

/** ID con el que se registran los clics de compra de la landing (Supabase y Pixel). */
export const LANDING_STEP_ID = "landing";

type Props = { label?: string; position?: "top" | "bottom"; note?: boolean };

/** Botón de compra de la landing: va directo al checkout de Impultienda con las UTM de la visita. */
export function LandingBuy({ label = "Quiero empezar mi reto", position = "top", note = true }: Props) {
  return (
    <div>
      <BuyButton label={label} level="landing" stepId={LANDING_STEP_ID} stepIndex={0} stepName="Landing" position={position} />
      {note ? (
        <p className="mt-2 text-center text-[14px] text-muted">
          {price.offerLabel} · los 2 programas · pago seguro y acceso inmediato
        </p>
      ) : null}
    </div>
  );
}

/** Barra fija abajo en el celular, que aparece después del primer botón. */
export function StickyBuy() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur transition-transform md:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!show}
    >
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="shrink-0 leading-tight">
          <p className="text-[13px] text-muted line-through">{price.listLabel}</p>
          <p className="text-[20px] font-extrabold text-price">{price.offerLabel}</p>
        </div>
        <div className="flex-1">
          <BuyButton label="Empezar ahora" level="landing" stepId={LANDING_STEP_ID} stepIndex={0} stepName="Landing" position="bottom" />
        </div>
      </div>
    </div>
  );
}
