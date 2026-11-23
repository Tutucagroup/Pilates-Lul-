import { describe, expect, it } from "vitest";
import { discountPercent, formatMoney, installmentAmount, price } from "../pricing";

describe("pricing", () => {
  it("calcula el 67% OFF de 45.000 → 14.900", () => {
    expect(discountPercent(45000, 14900)).toBe(67);
  });
  it("no da descuento negativo", () => {
    expect(discountPercent(10000, 12000)).toBe(0);
  });
  it("3 cuotas de 14.900 = 4.966", () => {
    expect(installmentAmount(14900, 3)).toBe(4966);
  });
  it("sin cuotas cuando installments < 2", () => {
    expect(installmentAmount(14900, 1)).toBeNull();
  });
  it("formatea en es-AR", () => {
    expect(formatMoney(14900)).toBe("$14.900");
    expect(formatMoney(45000)).toBe("$45.000");
  });
  it("los valores derivados salen de brand.config", () => {
    expect(price.offerLabel).toBe("$14.900");
    expect(price.listLabel).toBe("$45.000");
    expect(price.discount).toBe(67);
    expect(price.installments).toBeNull();
    expect(price.installmentLabel).toBeNull();
  });
});
