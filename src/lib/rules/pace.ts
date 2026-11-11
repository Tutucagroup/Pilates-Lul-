import { calcBmi, HEALTHY_BMI_MIN, weightForBmi } from "./bmi";

/**
 * Ritmo estimado hacia el peso objetivo.
 * - Máximo 0,5–1 kg por semana (rango prudente).
 * - Si el objetivo deja el IMC por debajo de 18,5, NO se promete fecha.
 * - Si el objetivo es igual o mayor al peso actual, no hay proyección de bajada.
 */
export const MIN_KG_PER_WEEK = 0.5;
export const MAX_KG_PER_WEEK = 1;

export type PaceStatus = "ok" | "unhealthy-target" | "maintain" | "invalid";

export type PacePoint = { week: number; kg: number };

export type Pace = {
  status: PaceStatus;
  currentKg: number;
  targetKg: number;
  diffKg: number;
  /** Semanas al ritmo de 1 kg/sem (lo más rápido que consideramos razonable). */
  weeksFast: number | null;
  /** Semanas al ritmo de 0,5 kg/sem (prudente). */
  weeksSlow: number | null;
  /** Fecha estimada a ritmo prudente (ISO yyyy-mm-dd). */
  targetDateSlow: string | null;
  targetDateFast: string | null;
  /** Peso mínimo saludable para la altura (IMC 18,5). */
  minHealthyKg: number;
  /** Curva semanal a ritmo prudente, para el gráfico. */
  points: PacePoint[];
};

export function estimatePace(
  heightCm: number,
  currentKg: number,
  targetKg: number,
  start: Date = new Date(),
): Pace {
  const minHealthyKg = weightForBmi(heightCm, HEALTHY_BMI_MIN);
  const base = {
    currentKg,
    targetKg,
    diffKg: round1(currentKg - targetKg),
    weeksFast: null,
    weeksSlow: null,
    targetDateSlow: null,
    targetDateFast: null,
    minHealthyKg,
    points: [] as PacePoint[],
  };

  if (![heightCm, currentKg, targetKg].every((n) => Number.isFinite(n) && n > 0)) {
    return { ...base, status: "invalid" };
  }
  if (calcBmi(heightCm, targetKg) < HEALTHY_BMI_MIN) {
    return { ...base, status: "unhealthy-target" };
  }
  if (targetKg >= currentKg - 0.5) {
    return { ...base, status: "maintain" };
  }

  const diff = currentKg - targetKg;
  const weeksSlow = Math.ceil(diff / MIN_KG_PER_WEEK);
  const weeksFast = Math.ceil(diff / MAX_KG_PER_WEEK);

  const points: PacePoint[] = [];
  for (let w = 0; w <= weeksSlow; w++) {
    points.push({ week: w, kg: round1(Math.max(targetKg, currentKg - w * MIN_KG_PER_WEEK)) });
  }

  return {
    ...base,
    status: "ok",
    weeksSlow,
    weeksFast,
    targetDateSlow: addWeeks(start, weeksSlow),
    targetDateFast: addWeeks(start, weeksFast),
    points,
  };
}

function addWeeks(d: Date, weeks: number): string {
  const out = new Date(d.getTime());
  out.setUTCDate(out.getUTCDate() + weeks * 7);
  return out.toISOString().slice(0, 10);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
