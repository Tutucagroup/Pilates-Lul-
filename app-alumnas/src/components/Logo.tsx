/** Logo de Pilates Lulú: flor de loto simple + nombre (el mismo de la landing). */
export function Logo() {
  return (
    <span className="inline-flex items-center gap-2" aria-label="Pilates Lulú">
      <svg width="30" height="22" viewBox="0 0 30 22" aria-hidden="true" fill="none">
        <path d="M15 2c3 3.5 3 9.5 0 14-3-4.5-3-10.5 0-14Z" fill="var(--color-brand)" />
        <path d="M15 16c-1.5-5 -6-8.5-11-8.5 0 5 4.5 9 11 8.5Z" fill="var(--color-brand)" opacity=".7" />
        <path d="M15 16c1.5-5 6-8.5 11-8.5 0 5-4.5 9-11 8.5Z" fill="var(--color-brand)" opacity=".7" />
        <path d="M3 19.5h24" stroke="var(--color-brand)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="font-display text-[19px] font-semibold tracking-tight text-ink">Pilates Lulú</span>
    </span>
  );
}
