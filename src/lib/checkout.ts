/**
 * Cart permalink de Shopify:
 *   https://{dominio}/cart/{variantId}:1?attributes[clave]=valor&utm_source=...
 * Los atributos del carrito quedan guardados en el pedido (Pedidos → "Detalles adicionales").
 */
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
};

export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type CartParams = {
  domain: string;
  variantId: string;
  quantity?: number;
  sessionId: string;
  attribution: Attribution;
  /** event_id del InitiateCheckout, para cruzar con Meta si hace falta. */
  checkoutEventId?: string;
  /** Variantes A/B vistas, p. ej. { edad: "B" } */
  variants?: Record<string, string>;
  level?: string;
};

export function buildCartUrl(p: CartParams): string {
  const domain = p.domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const url = new URL(`https://${domain}/cart/${encodeURIComponent(p.variantId)}:${p.quantity ?? 1}`);
  const attrs: Record<string, string | undefined> = {
    quiz_session: p.sessionId,
    ...p.attribution,
    checkout_event_id: p.checkoutEventId,
    quiz_level: p.level,
    ab_variants: p.variants && Object.keys(p.variants).length
      ? Object.entries(p.variants).map(([k, v]) => `${k}:${v}`).join(",")
      : undefined,
  };
  for (const [k, v] of Object.entries(attrs)) {
    if (v) url.searchParams.set(`attributes[${k}]`, v);
  }
  // Además, pasamos UTM y fbclid "planos" para que Shopify y el Pixel de la tienda
  // atribuyan la visita (el dominio de la tienda no ve las cookies del funnel).
  for (const k of UTM_KEYS) {
    const v = p.attribution[k];
    if (v) url.searchParams.set(k, v);
  }
  if (p.attribution.fbclid) url.searchParams.set("fbclid", p.attribution.fbclid);
  return url.toString();
}

/** Lee UTM + fbclid de un querystring. */
export function readAttribution(search: string): Attribution {
  const q = new URLSearchParams(search);
  const out: Attribution = {};
  for (const k of [...UTM_KEYS, "fbclid"] as const) {
    const v = q.get(k);
    if (v) out[k] = v.slice(0, 500);
  }
  return out;
}
