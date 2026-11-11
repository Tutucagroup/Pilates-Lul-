import { describe, expect, it } from "vitest";
import { funnel } from "@/config/funnel.config";
import { orderBenefits } from "../rules/benefits";
import { buildPlanSummary } from "../rules/summary";

describe("orderBenefits", () => {
  it("prioriza objetivo y zonas", () => {
    const ordered = orderBenefits(funnel.offer.benefits, {
      objetivo: "movilidad",
      zonas: ["espalda"],
    }).map((b) => b.id);
    expect(ordered[0]).toBe("movilidad");
    expect(ordered.indexOf("postura")).toBeLessThan(ordered.indexOf("brazos"));
  });
  it("con objetivo tonificar y zona abdomen, abdomen va primero", () => {
    const ordered = orderBenefits(funnel.offer.benefits, { objetivo: "tonificar", zonas: ["abdomen"] });
    expect(ordered[0].id).toBe("abdomen");
  });
  it("sin respuestas mantiene el orden del config", () => {
    expect(orderBenefits(funnel.offer.benefits, {}).map((b) => b.id)).toEqual(
      funnel.offer.benefits.map((b) => b.id),
    );
  });
});

describe("buildPlanSummary", () => {
  const answers = {
    edad: "50-59",
    objetivo: "peso",
    zonas: ["abdomen", "piernas"],
    inactividad: "3y+",
    sensacion: "molestias",
    altura: 160,
    peso: 75,
    "peso-objetivo": 68,
    sintomas: ["dolor-articular"],
  };
  const s = buildPlanSummary(funnel, answers, new Date("2026-01-01T00:00:00Z"));
  it("nombra objetivo y zonas", () => {
    expect(s.goalLabel).toBe("Bajar de peso");
    expect(s.zoneLabels).toEqual(["Abdomen", "Piernas y glúteos"]);
  });
  it("elige nivel suave", () => {
    expect(s.level).toBe("suave");
    expect(s.hasDiscomfort).toBe(true);
  });
  it("calcula IMC y ritmo", () => {
    expect(s.bmi).toBe(29.3);
    expect(s.bmiRange?.id).toBe("encima");
    expect(s.pace?.status).toBe("ok");
    expect(s.pace?.weeksSlow).toBe(14);
  });
  it("beneficios ordenados por objetivo", () => {
    expect(s.benefitIds[0]).toBe("peso");
  });
  it('"Todo el cuerpo" se muestra solo', () => {
    const t = buildPlanSummary(funnel, { zonas: ["abdomen", "todo"] });
    expect(t.zoneLabels).toEqual(["Todo el cuerpo"]);
  });
});
