/**
 * RECURSOS (guías, ebooks, extras)
 *
 * Agregá acá tus materiales. Cada uno se muestra en la pantalla Recursos.
 *   - url: enlace al PDF o a la página de compra. Se abre en una pestaña nueva.
 *   - price: texto libre, por ejemplo "ARS 4.900". Dejalo vacío ("") si es gratis o está incluido.
 *
 * Ejemplo:
 *   { title: "Guía de estiramientos", description: "Rutinas de 5 minutos para todos los días.", kind: "Ebook", price: "", url: "https://..." },
 */
export type Resource = { title: string; description: string; kind: string; price: string; url: string };

export const resources: Resource[] = [];
