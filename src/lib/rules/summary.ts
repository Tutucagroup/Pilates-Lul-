import type { Answers, FunnelConfig, Option, Step } from "@/funnel/types";
import { bmiRange, calcBmi, type BmiRange } from "./bmi";
import { chooseLevel, LEVEL_LABELS, type Level } from "./level";
import { estimatePace, type Pace } from "./pace";
import { orderBenefits } from "./benefits";

export type PlanSummary = {
  goalId: string | null;
  goalLabel: string | null;
  zoneLabels: string[];
  improveLabels: string[];
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

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** Arma el resumen personalizado a partir de las respuestas. Función pura. */
export function buildPlanSummary(config: FunnelConfig, answers: Answers, today = new Date()): PlanSummary {
  const { steps } = config;
  const goalId = typeof answers["objetivo"] === "string" ? answers["objetivo"] : null;
  const zones = answers["zonas"];
  const zoneLabels = Array.isArray(zones) && zones.includes("todo")
    ? labelsFor(steps, "zonas", ["todo"])
    : labelsFor(steps, "zonas", zones);

  const heightCm = num(answers["altura"]);
  const weightKg = num(answers["peso"]);
  const targetKg = num(answers["peso-objetivo"]);

  const bmi = heightCm && weightKg ? calcBmi(heightCm, weightKg) : null;
  const pace = heightCm && weightKg && targetKg ? estimatePace(heightCm, weightKg, targetKg, today) : null;
  const level = chooseLevel(answers);

  const symptoms = Array.isArray(answers["sintomas"]) ? answers["sintomas"] : [];

  return {
    goalId,
    goalLabel: labelsFor(steps, "objetivo", goalId)[0] ?? null,
    zoneLabels,
    improveLabels: labelsFor(steps, "mejorar", answers["mejorar"]),
    level,
    levelLabel: LEVEL_LABELS[level],
    bmi,
    bmiRange: bmi ? bmiRange(bmi) : null,
    pace,
    heightCm,
    weightKg,
    targetKg,
    hasDiscomfort: answers["sensacion"] === "molestias" || symptoms.includes("dolor-articular"),
    benefitIds: orderBenefits(config.offer.benefits, answers).map((b) => b.id),
  };
}
