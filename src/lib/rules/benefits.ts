import type { Answers, Benefit } from "@/funnel/types";

/** Todos los IDs de opciones elegidas por la usuaria, aplanados. */
export function selectedIds(answers: Answers): Set<string> {
  const out = new Set<string>();
  for (const v of Object.values(answers)) {
    if (typeof v === "string") out.add(v);
    else if (Array.isArray(v)) v.forEach((x) => out.add(x));
  }
  return out;
}

/** Pesos: el objetivo principal y las zonas pesan más que el resto. */
const WEIGHTED_STEPS: Record<string, number> = { objetivo: 3, zonas: 2, lograr: 2 };

/**
 * Ordena los beneficios de la oferta según las respuestas.
 * Orden estable: a igual puntaje, se respeta el orden del config.
 */
export function orderBenefits(benefits: Benefit[], answers: Answers): Benefit[] {
  const all = selectedIds(answers);
  const weighted = new Map<string, number>();
  for (const [stepId, w] of Object.entries(WEIGHTED_STEPS)) {
    const v = answers[stepId];
    const ids = typeof v === "string" ? [v] : Array.isArray(v) ? v : [];
    ids.forEach((id) => weighted.set(id, Math.max(weighted.get(id) ?? 0, w)));
  }
  // "Todo el cuerpo" activa todas las zonas.
  if (all.has("todo")) ["abdomen", "brazos", "piernas", "espalda"].forEach((z) => all.add(z));

  const score = (b: Benefit) =>
    b.tags.reduce((acc, t) => acc + (weighted.get(t) ?? (all.has(t) ? 1 : 0)), 0);

  return benefits
    .map((b, i) => ({ b, i, s: score(b) }))
    .sort((a, z) => z.s - a.s || a.i - z.i)
    .map((x) => x.b);
}
