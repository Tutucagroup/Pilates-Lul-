/**
 * brand.config.ts — ÚNICA fuente de verdad para marca, precios, checkout y tracking.
 *
 * Ningún componente escribe estos valores a mano: todos leen de acá (o de los
 * valores derivados en src/lib/pricing.ts, que se calculan a partir de acá).
 *
 * Para cambiar un precio, una garantía o el ID del Pixel: editá este archivo y listo.
 */

export const brand = {
  name: "Pilates Lulú",
  method: "Pilates Asiático",
  tagline: "Pilates Asiático para mujeres +40",
  audience: "mujeres de 40 a 70 años",
  country: "AR",
  locale: "es-AR",
  /**
   * URL pública del funnel (sin barra final). Se usa en metadatos y Open Graph.
   * Si no definís NEXT_PUBLIC_SITE_URL, se usa sola la URL de producción de Vercel.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  /** Email de soporte. Vacío = no se muestra. Usá uno de un dominio que sea tuyo. */
  supportEmail: "",

  colors: {
    background: "#fafaf9",
    primary: "#c26d7d", // rosa viejo
    price: "#16a34a", // verde para precio y botón de compra
  },

  program: {
    name: "Reto de 28 días",
    days: 28,
    minutesPerDay: 15,
  },

  pricing: {
    currency: "ARS",
    /** Precio de lista (se muestra tachado). En Shopify: "Precio de comparación". */
    listPrice: 45000,
    /** Precio de oferta. En Shopify: "Precio". */
    offerPrice: 19900,
    /** Cuotas sin interés que ofrece tu medio de pago. 0 o 1 = no mostrar cuotas. */
    installments: 3,
  },

  guarantee: {
    days: 7,
  },

  shopify: {
    /** Dominio .myshopify.com de la tienda (no el dominio propio). */
    domain: "libia-app.myshopify.com",
    /** ID numérico de la variante del producto digital. */
    variantId: "67954838274125",
  },

  meta: {
    /** ID del Meta Pixel / dataset. Vacío = el Pixel no se carga. */
    pixelId: "",
    /** Versión de la Graph API para Conversions API. */
    graphApiVersion: "v21.0",
    /**
     * Si true, el funnel envía InitiateCheckout al tocar "comprar".
     * Ver README → "Evitar duplicados de InitiateCheckout".
     */
    sendInitiateCheckout: true,
  },

  /**
   * Urgencia SOLO real. Por defecto apagada.
   * - countdown.endsAt: fecha ISO real en la que termina el precio de oferta.
   * - stock.remaining: cupos reales disponibles (actualizalo vos).
   * Si el valor es null, el componente no se muestra.
   */
  urgency: {
    countdown: { endsAt: null as string | null },
    stock: { remaining: null as number | null, label: "cupos con acompañamiento" },
  },
} as const;

export type Brand = typeof brand;
