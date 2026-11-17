import { describe, expect, it } from "vitest";
import { buildCheckoutUrl, readAttribution } from "../checkout";

describe("checkout", () => {
  it("arma el link al checkout con UTM y fbclid", () => {
    const url = new URL(
      buildCheckoutUrl({
        checkoutUrl: "https://pilates-lulu.impultienda.ar/checkout",
        attribution: { utm_source: "facebook", utm_campaign: "reto", fbclid: "IwAR0abc" },
      }),
    );
    expect(url.origin + url.pathname).toBe("https://pilates-lulu.impultienda.ar/checkout");
    expect(url.searchParams.get("utm_source")).toBe("facebook");
    expect(url.searchParams.get("utm_campaign")).toBe("reto");
    expect(url.searchParams.get("fbclid")).toBe("IwAR0abc");
    expect(url.searchParams.has("utm_medium")).toBe(false);
  });
  it("sin atribución deja el link limpio", () => {
    expect(buildCheckoutUrl({ checkoutUrl: "https://pilates-lulu.impultienda.ar/checkout", attribution: {} })).toBe(
      "https://pilates-lulu.impultienda.ar/checkout",
    );
  });
  it("lleva el upsell tildado por su posición", () => {
    const url = new URL(
      buildCheckoutUrl({ checkoutUrl: "https://pilates-lulu.impultienda.ar/checkout", attribution: { utm_source: "ig" }, upsells: [1] }),
    );
    expect(url.searchParams.get("upsells")).toBe("1");
    expect(url.searchParams.get("utm_source")).toBe("ig");
    expect(buildCheckoutUrl({ checkoutUrl: "https://x.test/checkout", attribution: {}, upsells: [0] })).toBe("https://x.test/checkout");
  });
  it("lee UTM y fbclid del querystring", () => {
    expect(readAttribution("?utm_source=ig&fbclid=x&otro=1")).toEqual({ utm_source: "ig", fbclid: "x" });
  });
});
