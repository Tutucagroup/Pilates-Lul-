/**
 * Motor del funnel: funciones puras sobre funnel.config.ts.
 * Sin React, sin estado: fáciles de testear.
 */
import type { Answers, Condition, Option, RulerStep, Step } from "./types";

export function evalCondition(cond: Condition | undefined, answers: Answers): boolean {
  if (!cond) return true;
  const v = answers[cond.stepId];
  if (typeof v === "string") return cond.anyOf.includes(v);
  if (Array.isArray(v)) return v.some((x) => cond.anyOf.includes(x));
  if (typeof v === "number") return cond.anyOf.includes(String(v));
  return false;
}

/** Pasos que corresponden mostrar según las respuestas actuales (aplica showIf). */
export function visibleSteps(steps: Step[], answers: Answers): Step[] {
  return steps.filter((s) => evalCondition(s.showIf, answers));
}

export function stepIndex(steps: Step[], id: string): number {
  return steps.findIndex((s) => s.id === id);
}

export function nextStepId(steps: Step[], currentId: string, answers: Answers): string | null {
  const vis = visibleSteps(steps, answers);
  const i = stepIndex(vis, currentId);
  return i >= 0 && i < vis.length - 1 ? vis[i + 1].id : null;
}

export function prevStepId(steps: Step[], currentId: string, answers: Answers): string | null {
  const vis = visibleSteps(steps, answers);
  const i = stepIndex(vis, currentId);
  return i > 0 ? vis[i - 1].id : null;
}

/** Pasos que se cuentan en la barra de progreso (el cuestionario, sin loader/resultado/oferta). */
export function isQuestionStep(s: Step): boolean {
  return s.type !== "loader" && s.type !== "result" && s.type !== "offer";
}

/** Progreso 0..1 del paso actual dentro de las preguntas visibles. */
export function progressFor(steps: Step[], currentId: string, answers: Answers): number {
  const q = visibleSteps(steps, answers).filter(isQuestionStep);
  const i = stepIndex(q, currentId);
  if (i < 0) return 1;
  return (i + 1) / q.length;
}

/** ¿El paso tiene una respuesta válida? Los pasos info/loader no requieren respuesta. */
export function isAnswered(step: Step, answers: Answers): boolean {
  const v = answers[step.id];
  switch (step.type) {
    case "single":
      return typeof v === "string" && step.options.some((o) => o.id === v);
    case "multi":
      return Array.isArray(v) && v.length > 0;
    case "ruler":
      return typeof v === "number" && v >= step.min && v <= step.max;
    default:
      return true;
  }
}

/** Primer paso de pregunta visible sin responder (para retomar o para proteger el resultado). */
export function firstUnanswered(steps: Step[], answers: Answers): Step | null {
  return visibleSteps(steps, answers).filter(isQuestionStep).find((s) => !isAnswered(s, answers)) ?? null;
}

/** Selección múltiple con opciones excluyentes ("Ninguna"). */
export function toggleMulti(options: Option[], current: string[], id: string): string[] {
  const opt = options.find((o) => o.id === id);
  if (!opt) return current;
  if (current.includes(id)) return current.filter((x) => x !== id);
  if (opt.exclusive) return [id];
  const exclusiveIds = new Set(options.filter((o) => o.exclusive).map((o) => o.id));
  return [...current.filter((x) => !exclusiveIds.has(x)), id];
}

/** Valor inicial de una regla, en métrico. */
export function rulerInitial(step: RulerStep, answers: Answers): number {
  const clamp = (n: number) => Math.min(step.max, Math.max(step.min, n));
  const saved = answers[step.id];
  if (typeof saved === "number") return clamp(saved);
  if (typeof step.initial === "number") return clamp(step.initial);
  const from = answers[step.initial.fromStep];
  return clamp(typeof from === "number" ? Math.round(from + step.initial.offset) : step.initial.fallback);
}

/* ---------- A/B ---------- */

/** Hash FNV-1a de 32 bits → número estable para la misma entrada. */
export function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Asigna una variante de forma determinística por sesión + paso.
 * Devuelve "A" (control) si el paso no tiene variantes.
 */
export function assignVariant(step: Step, sessionId: string): string {
  if (!step.variants || Object.keys(step.variants).length === 0) return "A";
  const buckets: [string, number][] = [
    ["A", step.controlWeight ?? 50],
    ...Object.entries(step.variants).map(([k, v]) => [k, v.weight] as [string, number]),
  ];
  const total = buckets.reduce((a, [, w]) => a + Math.max(0, w), 0);
  if (total <= 0) return "A";
  let r = hash32(`${sessionId}:${step.id}`) % total;
  for (const [k, w] of buckets) {
    if (r < w) return k;
    r -= w;
  }
  return "A";
}

/** Devuelve el paso con los campos de la variante aplicados. */
export function applyVariant<S extends Step>(step: S, variant: string): S {
  if (variant === "A" || !step.variants?.[variant]) return step;
  return { ...step, ...step.variants[variant].override } as S;
}
