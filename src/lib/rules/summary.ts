import type { Answers, FunnelConfig, Option, Step } from "@/funnel/types";
import { bmiRange, calcBmi, type BmiRange } from "./bmi";
import { chooseLevel, LEVEL_LABELS, type Level } from "./level";
import { estimatePace, type Pace } from "./pace";
import { orderBenefits } from "./benefits";

export type PlanSummary = {
  goalId: string | null;
  goalLabel: string | null;
  zoneLabels: string[];
  /** Zona con molestias que el plan cuida ("Rodillas"), o null si no tiene. */
  careLabel: string | null;
  /** La misma zona para usar en una frase ("tus rodillas"). */
  careText: string | null;
  level: Level;
  levelLabel: string;
  bmi: number | null;
  bmiRange: BmiRange | null;
  pace: Pace | null;
  heightCm: number | null;
  weightKg: number | null;
  targetKg: number | null;
  hasDiscomfort: boolean;
  benefitIds: string[];
};

function optionsOf(steps: Step[], id: string): Option[] {
  const s = steps.find((x) => x.id === id);
  return s && (s.type === "single" || s.type === "multi") ? s.options : [];
}

function labelsFor(steps: Step[], stepId: string, value: unknown): string[] {
  const opts = optionsOf(steps, stepId);
  const ids = typeof value === "string" ? [value] : Array.isArray(value) ? value : [];
  return ids.map((id) => opts.find((o) => o.id === id)?.label).filter((x): x is string => !!x);
}

/** Cómo nombrar cada zona con molestias dentro de una frase ("cuidando tus rodillas"). */
const CARE_TEXT: Record<string, string> = {
  rodillas: "tus rodillas",
  cadera: "tu cadera",
  espalda: "tu espalda y tu cintura",
  pies: "tus pies y tobillos",
};

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Arma el resumen personalizado a partir de las respuestas. Función pura. */
export function buildPlanSummary(config: FunnelConfig, answers: Answers, today = new Date()): PlanSummary {
  const { steps } = config;
  // El objetivo es cuántos kilos quiere bajar: "De 4 a 6 kg" → "Bajar de 4 a 6 kg".
  const goalId = typeof answers["kilos"] === "string" ? answers["kilos"] : null;
  const kilosLabel = labelsFor(steps, "kilos", goalId)[0];
  const zoneLabels = labelsFor(steps, "zonas", answers["zonas"]);
  const discomfort = typeof answers["molestias"] === "string" && answers["molestias"] !== "ninguna" ? answers["molestias"] : null;

  const heightCm = num(answers["altura"]);
  const weightKg = num(answers["peso"]);
  const targetKg = num(answers["peso-objetivo"]);

  const bmi = heightCm && weightKg ? calcBmi(heightCm, weightKg) : null;
  const pace = heightCm && weightKg && targetKg ? estimatePace(heightCm, weightKg, targetKg, today) : null;
  const level = chooseLevel(answers);

  return {
    goalId,
    goalLabel: kilosLabel ? `Bajar ${kilosLabel.toLowerCase()}` : null,
    zoneLabels,
    careLabel: discomfort ? (labelsFor(steps, "molestias", discomfort)[0] ?? null) : null,
    careText: discomfort ? (CARE_TEXT[discomfort] ?? null) : null,
    level,
    levelLabel: LEVEL_LABELS[level],
    bmi,
    bmiRange: bmi ? bmiRange(bmi) : null,
    pace,
    heightCm,
    weightKg,
    targetKg,
    hasDiscomfort: discomfort !== null,
    benefitIds: orderBenefits(config.offer.benefits, answers).map((b) => b.id),
  };
}
