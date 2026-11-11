import { price } from "@/lib/pricing";

/** Precio de lista tachado, precio oferta, % calculado y cuotas. Todo sale de brand.config.ts. */
export function PriceBox() {
  return (
    <div className="rounded-3xl bg-white p-5 text-center ring-2 ring-price/30">
      <div className="flex items-center justify-center gap-3">
        <span className="text-[18px] text-muted line-through" aria-label={`Precio de lista ${price.listLabel}`}>
          {price.listLabel}
        </span>
        {price.discount > 0 ? (
          <span className="rounded-full bg-price px-3 py-1 text-[14px] font-extrabold text-white">{price.discount}% OFF</span>
        ) : null}
      </div>
      <p className="mt-1 text-5xl font-extrabold tracking-tight text-price tabular-nums">
        {price.offerLabel}
        <span className="ml-1 align-top text-base font-bold text-muted">{price.currency}</span>
      </p>
      {price.installments ? (
        <p className="mt-1 text-[16px] font-semibold text-ink">
          o {price.installments} cuotas sin interés de {price.installmentLabel}
        </p>
      ) : null}
      <p className="mt-1 text-[14px] text-muted">Pago único · sin suscripción</p>
    </div>
  );
}
