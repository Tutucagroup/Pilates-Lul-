import { describe, expect, it } from "vitest";
import { chooseLevel, levelScore } from "../rules/level";

describe("level", () => {
  it("sin molestias, menos de 60 y cuerpo regular → intermedio", () => {
    expect(chooseLevel({ molestias: "ninguna", edad: "50-54", cuerpo: "regular" })).toBe("intermedio");
  });
  it("cualquier molestia → suave", () => {
    for (const m of ["rodillas", "cadera", "espalda", "pies"]) {
      expect(chooseLevel({ molestias: m, edad: "40-49", cuerpo: "regular" })).toBe("suave");
    }
  });
  it("65 o más → suave", () => {
    expect(chooseLevel({ molestias: "ninguna", edad: "65+", cuerpo: "regular" })).toBe("suave");
  });
  it("60-64 con sobrepeso → suave; 60-64 solo → intermedio", () => {
    expect(chooseLevel({ molestias: "ninguna", edad: "60-64", cuerpo: "sobrepeso" })).toBe("suave");
    expect(chooseLevel({ molestias: "ninguna", edad: "60-64", cuerpo: "flacido" })).toBe("intermedio");
    expect(levelScore({ molestias: "rodillas", edad: "65+", cuerpo: "sobrepeso" })).toBe(5);
  });
  it("sin datos → suave por seguridad", () => {
    expect(chooseLevel({})).toBe("suave");
  });
});
