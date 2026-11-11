export type HeightUnit = "cm" | "in";
export type WeightUnit = "kg" | "lb";

export const CM_PER_IN = 2.54;
export const LB_PER_KG = 2.20462;

export const cmToIn = (cm: number) => cm / CM_PER_IN;
export const inToCm = (inches: number) => inches * CM_PER_IN;
export const kgToLb = (kg: number) => kg * LB_PER_KG;
export const lbToKg = (lb: number) => lb / LB_PER_KG;

/** Convierte un valor métrico a la unidad de visualización (redondeado a entero). */
export function toDisplay(metric: number, unit: HeightUnit | WeightUnit): number {
  if (unit === "in") return Math.round(cmToIn(metric));
  if (unit === "lb") return Math.round(kgToLb(metric));
  return Math.round(metric);
}

/** Convierte desde la unidad de visualización a métrico (con 1 decimal). */
export function fromDisplay(value: number, unit: HeightUnit | WeightUnit): number {
  if (unit === "in") return Math.round(inToCm(value) * 10) / 10;
  if (unit === "lb") return Math.round(lbToKg(value) * 10) / 10;
  return value;
}

/** 160 cm → `5' 3"` */
export function formatFeetInches(inches: number): string {
  const ft = Math.floor(inches / 12);
  const rest = Math.round(inches - ft * 12);
  return `${ft}' ${rest}"`;
}
