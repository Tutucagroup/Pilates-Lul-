import { describe, expect, it } from "vitest";
import { buildCartUrl, readAttribution } from "../checkout";

describe("checkout", () => {
  it("arma el cart permalink con atributos, UTM y fbclid", () => {
    const url = new URL(
      buildCartUrl({
        domain: "https://mi-tienda.myshopify.com/",
        variantId: "4455667788",
        sessionId: "sess_123",
        attribution: { utm_source: "facebook", utm_campaign: "reto", fbclid: "IwAR0abc" },
        checkoutEventId: "ic_1",
        variants: { edad: "B" },
        level: "suave",
      }),
    );
    expect(url.origin + url.pathname).toBe("https://mi-tienda.myshopify.com/cart/4455667788:1");
    expect(url.searchParams.get("attributes[quiz_session]")).toBe("sess_123");
    expect(url.searchParams.get("attributes[utm_source]")).toBe("facebook");
    expect(url.searchParams.get("attributes[fbclid]")).toBe("IwAR0abc");
    expect(url.searchParams.get("attributes[checkout_event_id]")).toBe("ic_1");
    expect(url.searchParams.get("attributes[ab_variants]")).toBe("edad:B");
    expect(url.searchParams.get("attributes[quiz_level]")).toBe("suave");
    expect(url.searchParams.get("utm_campaign")).toBe("reto");
    expect(url.searchParams.get("fbclid")).toBe("IwAR0abc");
    expect(url.searchParams.has("attributes[utm_medium]")).toBe(false);
  });
  it("lee UTM y fbclid del querystring", () => {
    expect(readAttribution("?utm_source=ig&fbclid=x&otro=1")).toEqual({ utm_source: "ig", fbclid: "x" });
  });
});
