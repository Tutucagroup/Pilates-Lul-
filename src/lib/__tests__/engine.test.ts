import { describe, expect, it } from "vitest";
import { funnel } from "@/config/funnel.config";
import {
  applyVariant,
  assignVariant,
  evalCondition,
  firstUnanswered,
  nextStepId,
  progressFor,
  rulerInitial,
  toggleMulti,
  visibleSteps,
} from "@/funnel/engine";
import type { RulerStep, Step } from "@/funnel/types";

const steps = funnel.steps;

describe("config", () => {
  it("tiene 19 pasos con IDs únicos", () => {
    expect(steps).toHaveLength(19);
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });
  it("usa los 7 tipos de paso", () => {
    expect(new Set(steps.map((s) => s.type))).toEqual(
      new Set(["single", "multi", "info", "ruler", "loader", "result", "offer"]),
    );
  });
  it("todo el texto usa voseo (sin 'tú', 'tienes', 'quieres', 'puedes')", () => {
    const text = JSON.stringify(steps) + JSON.stringify({ ...funnel.offer, headline: 0, subheadline: 0, guaranteeText: 0 });
    expect(text).not.toMatch(/\b(tú|tienes|quieres|puedes|eres|sientes|haces)\b/i);
  });
});

describe("engine", () => {
  it("condiciones", () => {
    expect(evalCondition({ stepId: "sensacion", anyOf: ["molestias"] }, { sensacion: "molestias" })).toBe(true);
    expect(evalCondition({ stepId: "zonas", anyOf: ["brazos"] }, { zonas: ["abdomen", "brazos"] })).toBe(true);
    expect(evalCondition({ stepId: "zonas", anyOf: ["brazos"] }, {})).toBe(false);
    expect(evalCondition(undefined, {})).toBe(true);
  });

  it("showIf saltea pasos", () => {
    const custom: Step[] = [
      { id: "a", name: "a", type: "single", layout: "list", title: "A", options: [{ id: "x", label: "x" }, { id: "y", label: "y" }] },
      { id: "b", name: "b", type: "info", title: "B", text: "", cta: "ok", showIf: { stepId: "a", anyOf: ["x"] } },
      { id: "c", name: "c", type: "info", title: "C", text: "", cta: "ok" },
    ];
    expect(nextStepId(custom, "a", { a: "y" })).toBe("c");
    expect(nextStepId(custom, "a", { a: "x" })).toBe("b");
    expect(visibleSteps(custom, { a: "y" }).map((s) => s.id)).toEqual(["a", "c"]);
  });

  it("'Ninguna' es excluyente", () => {
    const opts = (steps.find((s) => s.id === "sintomas") as Extract<Step, { type: "multi" }>).options;
    let sel = toggleMulti(opts, [], "duermo-mal");
    sel = toggleMulti(opts, sel, "cansancio");
    expect(sel).toEqual(["duermo-mal", "cansancio"]);
    sel = toggleMulti(opts, sel, "ninguna");
    expect(sel).toEqual(["ninguna"]);
    sel = toggleMulti(opts, sel, "humor");
    expect(sel).toEqual(["humor"]);
    sel = toggleMulti(opts, sel, "humor");
    expect(sel).toEqual([]);
  });

  it("peso objetivo arranca en peso actual - 5", () => {
    const step = steps.find((s) => s.id === "peso-objetivo") as RulerStep;
    expect(rulerInitial(step, { peso: 80 })).toBe(75);
    expect(rulerInitial(step, {})).toBe(65);
    expect(rulerInitial(step, { peso: 42 })).toBe(40); // respeta el mínimo
  });

  it("progreso y primer paso sin responder", () => {
    expect(progressFor(steps, "edad", {})).toBeCloseTo(1 / 16);
    expect(progressFor(steps, "sintomas", {})).toBe(1);
    expect(firstUnanswered(steps, {})?.id).toBe("edad");
    expect(firstUnanswered(steps, { edad: "50-59" })?.id).toBe("objetivo");
  });

  it("asignación A/B determinística y aproximadamente pareja", () => {
    const step: Step = {
      ...steps[0],
      variants: { B: { weight: 50, override: { subtitle: "Variante B" } } },
    } as Step;
    expect(assignVariant(step, "s1")).toBe(assignVariant(step, "s1"));
    const counts = { A: 0, B: 0 } as Record<string, number>;
    for (let i = 0; i < 4000; i++) counts[assignVariant(step, `sess-${i}`)]++;
    expect(counts.A / 4000).toBeGreaterThan(0.45);
    expect(counts.A / 4000).toBeLessThan(0.55);
    expect((applyVariant(step, "B") as { subtitle?: string }).subtitle).toBe("Variante B");
    expect(applyVariant(step, "A")).toBe(step);
    expect(assignVariant(steps[1], "s1")).toBe("A");
  });
});
