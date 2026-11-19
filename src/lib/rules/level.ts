import type { Answers } from "@/funnel/types";

/**
 * Nivel del plan según:
 *  - paso "molestias" (dónde siente molestias al moverse),
 *  - paso "edad",
 *  - paso "cuerpo" (cómo describe su cuerpo).
 * Puntaje >= SUAVE_THRESHOLD → "suave"; si no, "intermedio".
 * Ante la duda, suave: es más seguro empezar despacio.
 */
export type Level = "suave" | "intermedio";

export const LEVEL_LABELS: Record<Level, string> = {
  suave: "Suave",
  intermedio: "Intermedio",
};

export const SUAVE_THRESHOLD = 2;

const AGE_POINTS: Record<string, number> = { "40-49": 0, "50-54": 0, "55-59": 0, "60-64": 1, "65+": 2 };
const BODY_POINTS: Record<string, number> = { regular: 0, flacido: 0, sobrepeso: 1 };

export function levelScore(answers: Answers): number | null {
  const discomfort = answers["molestias"];
  const age = answers["edad"];
  const body = answers["cuerpo"];
  if (typeof discomfort !== "string" && typeof age !== "string" && typeof body !== "string") return null;

  let score = 0;
  // Cualquier molestia (rodillas, cadera, espalda, pies) ya alcanza para arrancar suave.
  if (typeof discomfort === "string" && discomfort !== "ninguna") score += 2;
  if (typeof age === "string") score += AGE_POINTS[age] ?? 0;
  if (typeof body === "string") score += BODY_POINTS[body] ?? 0;
  return score;
}

export function chooseLevel(answers: Answers): Level {
  const score = levelScore(answers);
  if (score === null) return "suave";
  return score >= SUAVE_THRESHOLD ? "suave" : "intermedio";
}
