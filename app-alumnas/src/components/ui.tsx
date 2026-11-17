import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "brand" | "soft" | "ghost";
const variants: Record<Variant, string> = {
  brand: "bg-brand text-white hover:bg-brand-dark disabled:opacity-40 [[data-theme=dark]_&]:text-bg",
  soft: "bg-brand-soft text-brand-dark hover:brightness-95 disabled:opacity-40",
  ghost: "bg-surface text-ink ring-1 ring-line hover:bg-brand-soft disabled:opacity-40",
};
const base =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[17px] font-bold transition-colors disabled:cursor-not-allowed";

export function Button({
  variant = "brand", className = "", ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button {...props} className={`${base} ${variants[variant]} ${className}`} />;
}

export function LinkButton({
  href, variant = "brand", className = "", children,
}: { href: string; variant?: Variant; className?: string; children: ReactNode }) {
  return <Link href={href} className={`${base} ${variants[variant]} ${className}`}>{children}</Link>;
}

export function Card({ className = "", id, children }: { className?: string; id?: string; children: ReactNode }) {
  return <section id={id} className={`rounded-3xl bg-surface p-5 ring-1 ring-line ${className}`}>{children}</section>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-brand ${className}`}>{children}</p>;
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-display text-[30px] font-semibold leading-tight text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
    </header>
  );
}

export function Chip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 shrink-0 rounded-full px-4 text-[15px] font-bold transition-colors ${
        active ? "bg-brand text-white [[data-theme=dark]_&]:text-bg" : "bg-surface text-ink ring-1 ring-line"
      }`}
    >
      {children}
    </button>
  );
}

/** Anillo de progreso. */
export function Ring({ value, total, size = 96 }: { value: number; total: number; size?: number }) {
  const r = (size - 12) / 2;
  const c = 2 * Math.PI * r;
  const pct = total ? Math.min(1, value / total) : 0;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${value} de ${total} días`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-brand-soft)" strokeWidth="10" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-brand)" strokeWidth="10"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className="font-display text-[26px] font-semibold">{value}</span>
        <span className="mt-0.5 text-[12px] font-bold text-muted">de {total}</span>
      </div>
    </div>
  );
}
