import { describe, expect, it } from "vitest";
import { funnel } from "@/config/funnel.config";
import { orderBenefits } from "../rules/benefits";
import { buildPlanSummary } from "../rules/summary";

describe("orderBenefits", () => {
  it("prioriza las zonas elegidas", () => {
    const ordered = orderBenefits(funnel.offer.benefits, { zonas: ["espalda"] }).map((b) => b.id);
    expect(ordered[0]).toBe("postura");
  });
  it("cola y piernas → piernas y glúteos primero", () => {
    const ordered = orderBenefits(funnel.offer.benefits, { zonas: ["cola"], molestias: "ninguna" });
    expect(ordered[0].id).toBe("piernas");
  });
  it("molestias en rodillas suben movilidad por encima de lo no elegido", () => {
    const ordered = orderBenefits(funnel.offer.benefits, { molestias: "rodillas" }).map((b) => b.id);
    expect(ordered[0]).toBe("movilidad");
  });
  it("sin respuestas mantiene el orden del config", () => {
    expect(orderBenefits(funnel.offer.benefits, {}).map((b) => b.id)).toEqual(
      funnel.offer.benefits.map((b) => b.id),
    );
  });
});

describe("buildPlanSummary", () => {
  const answers = {
    kilos: "7-10",
    molestias: "rodillas",
    edad: "55-59",
    cuerpo: "sobrepeso",
    zonas: ["abdomen", "cola"],
  };
  const s = buildPlanSummary(funnel, answers, new Date("2026-01-01T00:00:00Z"));
  it("nombra objetivo, zonas y molestia", () => {
    expect(s.goalLabel).toBe("Bajar de 7 a 10 kg");
    expect(s.zoneLabels).toEqual(["Abdomen", "Cola"]);
    expect(s.careLabel).toBe("Rodillas");
    expect(s.careText).toBe("tus rodillas");
  });
  it("elige nivel suave por la molestia", () => {
    expect(s.level).toBe("suave");
    expect(s.hasDiscomfort).toBe(true);
  });
  it("sin altura ni peso no muestra IMC ni ritmo", () => {
    expect(s.bmi).toBeNull();
    expect(s.pace).toBeNull();
  });
  it("arma el titular y el subtítulo de la oferta", () => {
    expect(funnel.offer.headline(s)).toBe("Tu reto de 28 días para bajar de 7 a 10 kg");
    expect(funnel.offer.subheadline(s)).toBe(
      "Nivel suave, con foco en abdomen y cola, cuidando tus rodillas. 15 minutos por día, en tu casa.",
    );
  });
  it('"No tengo molestias" no marca molestia', () => {
    const t = buildPlanSummary(funnel, { ...answers, molestias: "ninguna" });
    expect(t.careLabel).toBeNull();
    expect(t.hasDiscomfort).toBe(false);
  });
});
