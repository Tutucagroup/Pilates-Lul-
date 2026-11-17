import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { parsePayload, verifySignature, welcomeRecipient, type WebhookPayload } from "../impultienda/webhook";
import { escapeHtml, welcomeEmail } from "../impultienda/welcome-email";

const secret = "whsec_test";
const sign = (ts: string, body: string) => createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
const cfg = { storeId: "store-1", mainProductId: "prod-main" };

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

describe("welcomeRecipient", () => {
  it("manda a la compradora del reto, con el primer nombre", () => {
    expect(welcomeRecipient(payload(), cfg)).toEqual({ email: "ana@example.com", firstName: "Ana" });
  });
  it("funciona sin nombre", () => {
    expect(welcomeRecipient(payload({ customer: { email: "ana@example.com", name: "" } }), cfg)).toEqual({
      email: "ana@example.com",
      firstName: "",
    });
  });
  it("ignora otros eventos, otras tiendas, upsells post-compra y otros productos", () => {
    expect(welcomeRecipient(payload({}, "order.created"), cfg)).toEqual({ skip: "event_not_handled" });
    expect(welcomeRecipient(payload({ store: { id: "otra" } }), cfg)).toEqual({ skip: "other_store" });
    expect(welcomeRecipient(payload({ is_post_purchase: true }), cfg)).toEqual({ skip: "post_purchase" });
    expect(welcomeRecipient(payload({ items: [{ product_id: "otro" }] }), cfg)).toEqual({ skip: "product_not_mapped" });
    expect(welcomeRecipient(payload({ customer: { email: "no-es-mail" } }), cfg)).toEqual({ skip: "no_email" });
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
});
