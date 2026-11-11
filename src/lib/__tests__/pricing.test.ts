import { describe, expect, it } from "vitest";
import { discountPercent, formatMoney, installmentAmount, price } from "../pricing";

describe("pricing", () => {
  it("calcula el 56% OFF de 45.000 → 19.900", () => {
    expect(discountPercent(45000, 19900)).toBe(56);
  });
  it("no da descuento negativo", () => {
    expect(discountPercent(10000, 12000)).toBe(0);
  });
  it("3 cuotas de 19.900 = 6.633", () => {
    expect(installmentAmount(19900, 3)).toBe(6633);
  });
  it("sin cuotas cuando installments < 2", () => {
    expect(installmentAmount(19900, 1)).toBeNull();
  });
  it("formatea en es-AR", () => {
    expect(formatMoney(19900)).toBe("$19.900");
    expect(formatMoney(45000)).toBe("$45.000");
  });
  it("los valores derivados salen de brand.config", () => {
    expect(price.offerLabel).toBe("$19.900");
    expect(price.listLabel).toBe("$45.000");
    expect(price.discount).toBe(56);
    expect(price.installmentLabel).toBe("$6.633");
  });
});
