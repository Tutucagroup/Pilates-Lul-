import type { ButtonHTMLAttributes } from "react";

type Variant = "brand" | "buy" | "ghost";
const styles: Record<Variant, string> = {
  brand: "bg-brand text-white hover:bg-brand-dark disabled:bg-brand/40",
  buy: "bg-price text-white hover:bg-price-dark shadow-lg shadow-price/25 disabled:bg-price/40",
  ghost: "bg-white text-ink ring-1 ring-black/10 hover:bg-brand-soft",
};

/** Botón de 48px+ de alto, esquinas redondeadas. */
export function Button({ variant = "brand", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      {...props}
      className={`flex min-h-12 w-full items-center justify-center rounded-2xl px-5 py-3 text-[17px] font-bold transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className}`}
    />
  );
}
