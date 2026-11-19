import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { emailKey } from "../entitlements";
import { orderAccess, parsePayload, verifySignature, type WebhookPayload } from "../impultienda/webhook";
import { escapeHtml, welcomeEmail } from "../impultienda/welcome-email";

const secret = "whsec_test";
const sign = (ts: string, body: string) => createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
const cfg = { storeId: "store-1", mainProductId: "prod-main", addons: [{ productId: "prod-up", planId: "rejuvenece" }] };

const payload = (over: Partial<WebhookPayload["data"]> = {}, event = "order.approved"): WebhookPayload => ({
  id: "deliv-1",
  event,
  data: {
    order_id: "o1",
    order_number: 1,
    status: "approved",
    is_post_purchase: false,
    customer: { email: "ana@example.com", name: "Ana María", last_name: "Pérez" },
    items: [{ product_id: "prod-main", name: "Reto", type: "main" }],
    store: { id: "store-1", subdomain: "pilates-lulu" },
    ...over,
  },
});

describe("verifySignature", () => {
  const body = '{"id":"x","event":"order.approved","data":{}}';
  const now = 1_754_057_280;
  const ts = String(now);

  it("acepta la firma correcta", () => {
    expect(verifySignature({ secret, rawBody: body, timestamp: ts, signature: sign(ts, body), nowSeconds: now })).toBe("ok");
  });
  it("rechaza una firma de otro cuerpo", () => {
    expect(verifySignature({ secret, rawBody: body + " ", timestamp: ts, signature: sign(ts, body), nowSeconds: now })).toBe(
      "bad_signature",
    );
  });
  it("rechaza sin firma", () => {
    expect(verifySignature({ secret, rawBody: body, timestamp: ts, signature: null, nowSeconds: now })).toBe("bad_signature");
  });
  it("rechaza timestamps de más de 5 minutos", () => {
    expect(verifySignature({ secret, rawBody: body, timestamp: ts, signature: sign(ts, body), nowSeconds: now + 301 })).toBe(
      "stale",
    );
    expect(verifySignature({ secret, rawBody: body, timestamp: null, signature: sign(ts, body), nowSeconds: now })).toBe("stale");
  });
});

describe("parsePayload", () => {
  it("lee un aviso válido y rechaza basura", () => {
    expect(parsePayload(JSON.stringify(payload()))?.event).toBe("order.approved");
    expect(parsePayload("no json")).toBeNull();
    expect(parsePayload('{"event":"order.approved"}')).toBeNull();
  });
});

describe("orderAccess", () => {
  it("compra del reto: bienvenida, con el primer nombre", () => {
    expect(orderAccess(payload(), cfg)).toEqual({ email: "ana@example.com", firstName: "Ana", main: true, addonPlans: [] });
  });
  it("funciona sin nombre", () => {
    expect(orderAccess(payload({ customer: { email: "ana@example.com", name: "" } }), cfg)).toMatchObject({ firstName: "" });
  });
  it("reto + order bump: bienvenida con el plan adicional", () => {
    const items = [{ product_id: "prod-main", type: "main" }, { product_id: "prod-up", type: "upsell" }];
    expect(orderAccess(payload({ items }), cfg)).toMatchObject({ main: true, addonPlans: ["rejuvenece"] });
  });
  it("upsell post-compra o comprado solo: activa el plan sin bienvenida", () => {
    const items = [{ product_id: "prod-up", type: "upsell" }];
    expect(orderAccess(payload({ items, is_post_purchase: true }), cfg)).toMatchObject({ main: false, addonPlans: ["rejuvenece"] });
    expect(orderAccess(payload({ items }), cfg)).toMatchObject({ main: false, addonPlans: ["rejuvenece"] });
  });
  it("sin upsell configurado, el upsell solo no hace nada", () => {
    const items = [{ product_id: "prod-up", type: "upsell" }];
    expect(orderAccess(payload({ items }), { ...cfg, addons: [] })).toEqual({ skip: "product_not_mapped" });
  });
  it("ignora otros eventos, otras tiendas y otros productos", () => {
    expect(orderAccess(payload({}, "order.created"), cfg)).toEqual({ skip: "event_not_handled" });
    expect(orderAccess(payload({ store: { id: "otra" } }), cfg)).toEqual({ skip: "other_store" });
    expect(orderAccess(payload({ items: [{ product_id: "otro" }] }), cfg)).toEqual({ skip: "product_not_mapped" });
    expect(orderAccess(payload({ customer: { email: "no-es-mail" } }), cfg)).toEqual({ skip: "no_email" });
  });
});

describe("emailKey", () => {
  it("es el mismo para el mismo email, sin importar mayúsculas ni espacios", () => {
    const k = emailKey("Ana@Example.com ", "s1");
    expect(k).toMatch(/^[0-9a-f]{40}$/);
    expect(emailKey("ana@example.com", "s1")).toBe(k);
  });
  it("cambia con el email y con el secreto, y no contiene el email", () => {
    const k = emailKey("ana@example.com", "s1");
    expect(emailKey("eva@example.com", "s1")).not.toBe(k);
    expect(emailKey("ana@example.com", "s2")).not.toBe(k);
    expect(k).not.toContain("ana");
  });
});

describe("welcomeEmail", () => {
  const base = { firstName: "Ana", email: "ana@example.com", appUrl: "https://app.test", logoUrl: "https://x.test/logo.png" };

  it("arma asunto, saludo, link a la app y aviso del email", () => {
    const m = welcomeEmail(base);
    expect(m.subject).toBe("¡Bienvenida a Pilates Lulú! 🌸 Tu acceso ya está listo");
    expect(m.html).toContain("¡Hola, Ana!");
    expect(m.html).toContain('href="https://app.test"');
    expect(m.html).toContain("ana@example.com");
    expect(m.html).toContain("https://x.test/logo.png");
    expect(m.text).toContain("https://app.test");
  });
  it("marca las pruebas en el asunto", () => {
    expect(welcomeEmail({ ...base, test: true }).subject.startsWith("[Prueba] ")).toBe(true);
  });
  it("escapa el nombre", () => {
    const m = welcomeEmail({ ...base, firstName: "<script>" });
    expect(m.html).not.toContain("<script>");
    expect(m.html).toContain(escapeHtml("<script>"));
  });
  it("menciona los 2 programas incluidos y ya no pide activar nada", () => {
    const m = welcomeEmail(base);
    expect(m.html).toContain("y a Rejuvenecé después de los 50");
    expect(m.text).toContain("Rejuvenecé después de los 50");
    expect(m.html).not.toContain("ACTIVAR MI PLAN");
  });
});
