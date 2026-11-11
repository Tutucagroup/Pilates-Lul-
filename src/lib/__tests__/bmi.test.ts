import { describe, expect, it } from "vitest";
import { bmiRange, calcBmi, weightForBmi } from "../rules/bmi";

describe("bmi", () => {
  it("calcula IMC con 1 decimal", () => {
    expect(calcBmi(160, 70)).toBe(27.3);
    expect(calcBmi(170, 60)).toBe(20.8);
  });
  it("devuelve NaN con datos inválidos", () => {
    expect(calcBmi(0, 70)).toBeNaN();
  });
  it("asigna rangos de referencia sin diagnósticos", () => {
    expect(bmiRange(17)?.id).toBe("debajo");
    expect(bmiRange(18.5)?.id).toBe("dentro");
    expect(bmiRange(24.9)?.id).toBe("dentro");
    expect(bmiRange(25)?.id).toBe("encima");
    expect(bmiRange(31)?.id).toBe("muy-encima");
    expect(bmiRange(NaN)).toBeNull();
    for (const r of [17, 22, 27, 35].map(bmiRange)) {
      expect(r?.label).toMatch(/rango de referencia/);
    }
  });
  it("calcula el peso para un IMC", () => {
    expect(weightForBmi(160, 18.5)).toBe(47.4);
  });
});
