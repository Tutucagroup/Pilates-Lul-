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
  utm_id?: string;
  fbclid?: string;
};

/** utm_id lleva el ID del anuncio de Meta ({{ad.id}}): UTMIFLOW lo usa para cruzar el gasto con cada venta. */
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"] as const;

export type CheckoutParams = {
  /** URL completa del checkout de la tienda. */
  checkoutUrl: string;
  attribution: Attribution;
  /**
   * Upsells que llegan tildados al checkout, por su posición en la tienda (1 = el primero): ?upsells=1,2.
   * El checkout los sigue mostrando y la compradora los puede destildar.
   */
  upsells?: number[];
};

export function buildCheckoutUrl(p: CheckoutParams): string {
  const url = new URL(p.checkoutUrl);
  for (const k of UTM_KEYS) {
    const v = p.attribution[k];
    if (v) url.searchParams.set(k, v);
  }
  if (p.attribution.fbclid) url.searchParams.set("fbclid", p.attribution.fbclid);
  const ups = (p.upsells ?? []).filter((n) => Number.isInteger(n) && n > 0);
  if (ups.length) url.searchParams.set("upsells", ups.join(","));
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
