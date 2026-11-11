import { describe, expect, it } from "vitest";
import { chooseLevel, levelScore } from "../rules/level";

describe("level", () => {
  it("activa reciente y se mueve bien → intermedio", () => {
    expect(chooseLevel({ inactividad: "lt6m", sensacion: "bien", sintomas: ["ninguna"] })).toBe("intermedio");
  });
  it("molestias → suave", () => {
    expect(chooseLevel({ inactividad: "lt6m", sensacion: "molestias" })).toBe("suave");
  });
  it("muchos años sin actividad → suave", () => {
    expect(chooseLevel({ inactividad: "3y+", sensacion: "bien" })).toBe("suave");
    expect(chooseLevel({ inactividad: "nunca", sensacion: "bien" })).toBe("suave");
  });
  it("1-2 años + se cansa → suave", () => {
    expect(chooseLevel({ inactividad: "1-2y", sensacion: "cansancio" })).toBe("suave");
  });
  it("los síntomas suman, con tope", () => {
    expect(levelScore({ inactividad: "lt6m", sensacion: "bien", sintomas: ["dolor-articular"] })).toBe(1);
    expect(
      levelScore({ inactividad: "lt6m", sensacion: "bien", sintomas: ["dolor-articular", "suelo-pelvico", "cansancio"] }),
    ).toBe(2);
    expect(chooseLevel({ inactividad: "lt6m", sensacion: "bien", sintomas: ["dolor-articular", "suelo-pelvico"] })).toBe(
      "suave",
    );
  });
  it("sin datos → suave por seguridad", () => {
    expect(chooseLevel({})).toBe("suave");
  });
});
