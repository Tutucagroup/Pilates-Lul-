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
    /** ID del plan del reto en la app de alumnas (app-alumnas/src/data/program.ts). */
    appPlanId: "pilates28",
  },

  pricing: {
    currency: "ARS",
    /** Precio de lista (se muestra tachado). Tiene que coincidir con el precio tachado de Impultienda. */
    listPrice: 45000,
    /** Precio de oferta. Tiene que coincidir con el precio del producto en Impultienda. */
    offerPrice: 19900,
    /** Cuotas sin interés que ofrece tu medio de pago. 0 o 1 = no mostrar cuotas. */
    installments: 3,
  },

  guarantee: {
    days: 7,
  },

  /**
   * Upsell: plan adicional "Rejuvenecé después de los 50" (order bump en el checkout de Impultienda).
   * Con productId vacío no se ofrece en el quiz y el webhook no lo activa.
   * También se vende suelto desde la app de alumnas (botón "Sumalo" en /activar, con el link de compra propio).
   */
  upsell: {
    /** ID del producto upsell en Impultienda (sale de Diseño de ebooks o de impultienda_listar_productos). */
    productId: "50ea7b14-43ec-4901-b615-f81b4da73143",
    /**
     * true cuando el upsell aparece como order bump en el checkout (en Impultienda, «Disponible solo en
     * post-compra» apagado). Mientras sea false, el quiz no muestra la tarjeta para sumarlo, porque el
     * checkout no lo cobraría; el webhook igual lo activa si se compra por su link propio.
     */
    inCheckout: false,
    /**
     * Posición del upsell entre los upsells de la tienda (1 = el primero). El link del checkout lo lleva
     * tildado con ?upsells=<posición>. Si sumás otro upsell antes que este, actualizá el número.
     */
    checkoutPosition: 1,
    /** ID del plan en la app de alumnas (app-alumnas/src/data/program.ts). */
    planId: "rejuvenece",
    name: "Rejuvenecé después de los 50",
    tagline: "Quema grasa y tonifica todo el cuerpo",
    classes: 20,
    /** Tiene que coincidir con el precio del upsell en Impultienda. */
    price: 5900,
  },

  impultienda: {
    /** Link al checkout de la tienda de Impultienda (el botón de compra del quiz lleva acá). */
    checkoutUrl: "https://pilates-lulu.impultienda.ar/checkout",
    /** ID del producto que se manda a Meta en InitiateCheckout (content_ids). */
    productId: "pilates-lulu-reto-28",
    /** ID de la tienda en Impultienda: el webhook solo procesa ventas de esta tienda. */
    storeId: "a7046554-4411-4986-9077-5449e49a4d13",
    /** ID del producto principal (el reto) en Impultienda: el mail de bienvenida sale solo si la compra lo incluye. */
    mainProductId: "48329805-3d4e-4dc2-a72b-2747672cc215",
  },

  /** App de alumnas: el producto que se entrega. Va en el mail de bienvenida. */
  appUrl: "https://app-alumnas.vercel.app",

  meta: {
    /** ID del Meta Pixel / dataset. Vacío = el Pixel no se carga. */
    pixelId: "1089968680039898",
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
