import { brand } from "@/config/brand.config";

/** Logo original de Pilates Lulú: flor de loto simple + nombre. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label={brand.name}>
      <svg width="30" height="22" viewBox="0 0 30 22" aria-hidden="true" fill="none">
        <path d="M15 2c3 3.5 3 9.5 0 14-3-4.5-3-10.5 0-14Z" fill="var(--color-brand)" />
        <path d="M15 16c-1.5-5 -6-8.5-11-8.5 0 5 4.5 9 11 8.5Z" fill="var(--color-brand)" opacity=".7" />
        <path d="M15 16c1.5-5 6-8.5 11-8.5 0 5-4.5 9-11 8.5Z" fill="var(--color-brand)" opacity=".7" />
        <path d="M3 19.5h24" stroke="var(--color-brand)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-extrabold tracking-tight text-ink">{brand.name}</span>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-brand">{brand.method}</span>
      </span>
    </span>
  );
}
