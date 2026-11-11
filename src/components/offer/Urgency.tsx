"use client";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand.config";

/**
 * Cuenta regresiva y cupos SOLO si están configurados con datos reales en brand.config.ts.
 * Por defecto (null) no se muestra nada. Cuando la fecha pasa, desaparece: no se reinicia.
 */
export function Urgency() {
  const endsAt = brand.urgency.countdown.endsAt ? Date.parse(brand.urgency.countdown.endsAt) : NaN;
  const stock = brand.urgency.stock.remaining;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!Number.isFinite(endsAt)) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);

  const left = now != null && Number.isFinite(endsAt) ? endsAt - now : null;
  const showCountdown = left != null && left > 0;
  const showStock = typeof stock === "number" && stock > 0;
  if (!showCountdown && !showStock) return null;

  const pad = (n: number) => String(n).padStart(2, "0");
  let label = "";
  if (showCountdown) {
    const s = Math.floor(left! / 1000);
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
    label = `${d > 0 ? `${d}d ` : ""}${pad(h)}:${pad(m)}:${pad(s % 60)}`;
  }

  return (
    <div className="mb-3 space-y-2 text-center">
      {showCountdown ? (
        <p className="rounded-2xl bg-brand-soft px-4 py-2 text-[15px] font-bold text-brand-dark">
          El precio de oferta termina en <span className="tabular-nums">{label}</span>
        </p>
      ) : null}
      {showStock ? (
        <p className="text-[15px] font-semibold text-ink">
          Quedan {stock} {brand.urgency.stock.label}
        </p>
      ) : null}
    </div>
  );
}
