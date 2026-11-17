/**
 * Link al checkout de Impultienda:
 *   https://pilates-lulu.impultienda.ar/checkout?utm_source=...&fbclid=...
 * Las UTM y el fbclid viajan en la URL para que Impultienda y el Pixel de la tienda
 * atribuyan la venta (el dominio de la tienda no ve las cookies del funnel).
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

export type CheckoutParams = {
  /** URL completa del checkout de la tienda. */
  checkoutUrl: string;
  attribution: Attribution;
};

export function buildCheckoutUrl(p: CheckoutParams): string {
  const url = new URL(p.checkoutUrl);
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
