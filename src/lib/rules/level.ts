import type { Answers } from "@/funnel/types";

/**
 * Nivel del plan según:
 *  - paso "inactividad" (hace cuánto no hace actividad),
 *  - paso "sensacion" (cómo se siente al hacer ejercicio),
 *  - paso "sintomas" (molestias que marcó).
 * Puntaje >= SUAVE_THRESHOLD → "suave"; si no, "intermedio".
 * Ante la duda, suave: es más seguro empezar despacio.
 */
export type Level = "suave" | "intermedio";

export const LEVEL_LABELS: Record<Level, string> = {
  suave: "Suave",
  intermedio: "Intermedio",
};

export const SUAVE_THRESHOLD = 2;

const INACTIVITY_POINTS: Record<string, number> = { lt6m: 0, "1-2y": 1, "3y+": 2, nunca: 2 };
const FEELING_POINTS: Record<string, number> = { molestias: 2, cansancio: 1, bien: 0 };
const SYMPTOM_POINTS: Record<string, number> = {
  "dolor-articular": 1,
  "suelo-pelvico": 1,
  cansancio: 1,
};
const MAX_SYMPTOM_POINTS = 2;

export function levelScore(answers: Answers): number | null {
  const inactivity = answers["inactividad"];
  const feeling = answers["sensacion"];
  if (typeof inactivity !== "string" && typeof feeling !== "string") return null;

  let score = 0;
  if (typeof inactivity === "string") score += INACTIVITY_POINTS[inactivity] ?? 0;
  if (typeof feeling === "string") score += FEELING_POINTS[feeling] ?? 0;

  const symptoms = Array.isArray(answers["sintomas"]) ? answers["sintomas"] : [];
  const sym = symptoms.reduce((acc, id) => acc + (SYMPTOM_POINTS[id] ?? 0), 0);
  score += Math.min(sym, MAX_SYMPTOM_POINTS);
  return score;
}

export function chooseLevel(answers: Answers): Level {
  const score = levelScore(answers);
  if (score === null) return "suave";
  return score >= SUAVE_THRESHOLD ? "suave" : "intermedio";
}
