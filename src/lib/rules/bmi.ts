/**
 * IMC (índice de masa corporal). Solo informativo: se muestra el rango de
 * referencia de la OMS sin diagnósticos ni etiquetas sobre la persona.
 */
export type BmiRangeId = "debajo" | "dentro" | "encima" | "muy-encima";

export type BmiRange = {
  id: BmiRangeId;
  /** Texto neutro para mostrar. */
  label: string;
  min: number;
  max: number;
};

export const BMI_RANGES: BmiRange[] = [
  { id: "debajo", label: "Por debajo del rango de referencia", min: 0, max: 18.5 },
  { id: "dentro", label: "Dentro del rango de referencia", min: 18.5, max: 25 },
  { id: "encima", label: "Por encima del rango de referencia", min: 25, max: 30 },
  { id: "muy-encima", label: "Bastante por encima del rango de referencia", min: 30, max: Infinity },
];

export const HEALTHY_BMI_MIN = 18.5;
export const HEALTHY_BMI_MAX = 24.9;

export function calcBmi(heightCm: number, weightKg: number): number {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return NaN;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiRange(bmi: number): BmiRange | null {
  if (!Number.isFinite(bmi)) return null;
  return BMI_RANGES.find((r) => bmi >= r.min && bmi < r.max) ?? null;
}

/** Peso (kg) que corresponde a un IMC dado para una altura. */
export function weightForBmi(heightCm: number, bmi: number): number {
  const m = heightCm / 100;
  return Math.round(bmi * m * m * 10) / 10;
}
