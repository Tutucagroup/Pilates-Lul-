const fmt = new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long", timeZone: "UTC" });
/** "2026-03-12" → "12 de marzo" */
export function formatDateEs(iso: string): string {
  return fmt.format(new Date(`${iso}T00:00:00Z`));
}

export function joinEs(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

/** 27.3 → "27,3" */
export const decimalEs = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 1 });
