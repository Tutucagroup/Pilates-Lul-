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
  it("tiene 7 pasos con IDs únicos (5 preguntas + loader + resultado)", () => {
    expect(steps).toHaveLength(7);
    expect(new Set(steps.map((s) => s.id)).size).toBe(steps.length);
  });
  it("usa los tipos de paso del quiz corto", () => {
    expect(new Set(steps.map((s) => s.type))).toEqual(
      new Set(["single", "multi", "loader", "result"]),
    );
  });
  it("todo el texto usa voseo (sin 'tú', 'tienes', 'quieres', 'puedes')", () => {
    const text = JSON.stringify(steps) + JSON.stringify({ ...funnel.offer, headline: 0, subheadline: 0, guaranteeText: 0 });
    expect(text).not.toMatch(/\b(tú|tienes|quieres|puedes|eres|sientes|haces)\b/i);
  });
});

describe("engine", () => {
  it("condiciones", () => {
    expect(evalCondition({ stepId: "molestias", anyOf: ["rodillas"] }, { molestias: "rodillas" })).toBe(true);
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
    const opts = [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
      { id: "ninguna", label: "Ninguna", exclusive: true },
    ];
    let sel = toggleMulti(opts, [], "a");
    sel = toggleMulti(opts, sel, "b");
    expect(sel).toEqual(["a", "b"]);
    sel = toggleMulti(opts, sel, "ninguna");
    expect(sel).toEqual(["ninguna"]);
    sel = toggleMulti(opts, sel, "a");
    expect(sel).toEqual(["a"]);
    sel = toggleMulti(opts, sel, "a");
    expect(sel).toEqual([]);
  });

  it("regla: el valor inicial sale del paso anterior", () => {
    const step: RulerStep = {
      id: "peso-objetivo", name: "x", type: "ruler", measure: "weight", title: "x", cta: "ok",
      min: 40, max: 150, initial: { fromStep: "peso", offset: -5, fallback: 65 },
    };
    expect(rulerInitial(step, { peso: 80 })).toBe(75);
    expect(rulerInitial(step, {})).toBe(65);
    expect(rulerInitial(step, { peso: 42 })).toBe(40); // respeta el mínimo
  });

  it("progreso y primer paso sin responder", () => {
    expect(progressFor(steps, "kilos", {})).toBeCloseTo(1 / 5);
    expect(progressFor(steps, "zonas", {})).toBe(1);
    expect(firstUnanswered(steps, {})?.id).toBe("kilos");
    expect(firstUnanswered(steps, { kilos: "4-6" })?.id).toBe("molestias");
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
