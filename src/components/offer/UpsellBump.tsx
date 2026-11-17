"use client";
import { brand } from "@/config/brand.config";
import { useQuiz } from "@/funnel/store";
import { formatMoney, price } from "@/lib/pricing";
import { upsellOn } from "./BuyButton";

/**
 * Oferta para sumar el plan adicional antes de ir al checkout (order bump).
 * Arranca destildada: la compradora elige. Si la tilda, el checkout abre con el upsell ya agregado.
 * No se muestra mientras brand.upsell.productId esté vacío.
 */
export function UpsellBump() {
  const on = useQuiz((s) => s.bump);
  const setBump = useQuiz((s) => s.setBump);
  if (!upsellOn) return null;
  const u = brand.upsell;

  return (
    <div className="mt-4">
      <label
        className={`flex cursor-pointer gap-3 rounded-3xl border-2 border-dashed p-4 transition-colors ${on ? "border-brand bg-brand-soft" : "border-brand/50 bg-white"}`}
      >
        <input
          type="checkbox"
          checked={on}
          onChange={(e) => setBump(e.target.checked)}
          className="mt-1 size-6 shrink-0 accent-[var(--color-brand)]"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand">Sumalo a tu plan</span>
          <span className="mt-1 block text-[17px] font-extrabold leading-snug">
            Sí, quiero sumar «{u.name}» por {formatMoney(u.price)}
          </span>
          <span className="mt-1 block text-[15px] text-muted">
            {u.tagline} · {u.classes} clases. Con los 2 programas tenés el programa completo de {brand.name}.
          </span>
        </span>
      </label>
      {on ? (
        <p className="mt-2 text-center text-[15px] font-bold text-ink" aria-live="polite">
          Total: {formatMoney(price.offer + u.price)} · los 2 programas
        </p>
      ) : null}
    </div>
  );
}
