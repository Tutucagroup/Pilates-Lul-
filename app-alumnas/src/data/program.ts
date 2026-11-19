/**
 * PLANES Y CLASES
 *
 * Cada plan tiene sus clases en orden. Para cada clase:
 *   - title / description: lo que ve la alumna.
 *   - minutes: duración del video (redondeada).
 *   - needs: elementos que hacen falta (opcional).
 *   - video: ID del video de YouTube (lo que va después de "v=" en el enlace).
 *
 * Los videos son del canal "Fuerte después de los 50 con Eu".
 */
export type Category = "Fuerza" | "Cardio" | "Movilidad";

export type ClassDay = {
  day: number;
  title: string;
  category: Category;
  minutes: number;
  description: string;
  needs?: string;
  video: string;
};

export type Plan = {
  id: string;
  name: string;
  subtitle: string;
  /** Clases por semana (7 = todos los días; 5 = de lunes a viernes). */
  perWeek: number;
  /**
   * Plan adicional que se vende aparte (upsell en Impultienda). Queda bloqueado hasta que la alumna
   * lo activa con su email de compra (pantalla /activar).
   */
  addon?: {
    /** Precio en pesos. Tiene que coincidir con el del upsell en Impultienda. */
    price: number;
    /**
     * Link de compra propio del upsell: en Impultienda → Diseño de ebooks → tarjeta del upsell →
     * tres puntitos → «Copiar link de compra». Vacío = no se muestra el botón para comprarlo desde la app.
     */
    buyUrl: string;
  };
  weeks: { name: string; text: string }[];
  classes: ClassDay[];
};

const c = (
  day: number, title: string, category: Category, minutes: number, video: string,
  description: string, needs?: string,
): ClassDay => ({ day, title, category, minutes, video, description, needs });

const pilates28: Plan = {
  id: "pilates28",
  name: "Pilates Asiático - Reto 28 días",
  subtitle: "Una clase por día durante cuatro semanas",
  perWeek: 7,
  weeks: [
    { name: "Empezar", text: "Tus primeras clases. Lo importante es aparecer cada día." },
    { name: "Sostener", text: "El cuerpo ya conoce la rutina. Seguimos sumando." },
    { name: "Tonificar", text: "Clases con foco: piernas, brazos, abdomen y cardio." },
    { name: "Completar", text: "Última semana. Cerrás tu reto con todo lo que ganaste." },
  ],
  classes: [
    c(1, "Piernas y glúteos", "Fuerza", 23, "3gpZVJSFu0o", "Tu primera clase: piernas y glúteos fuertes y tonificados."),
    c(2, "Brazos y abdomen", "Fuerza", 24, "w5a-GgvDQMo", "Brazos y abdomen fuertes y tonificados."),
    c(3, "Cuerpo fuerte y tonificado", "Fuerza", 21, "43GKO2bVhY4", "Clase de fuerza para todo el cuerpo."),
    c(4, "Cuerpo fuerte", "Fuerza", 22, "xuh-ABQzoUc", "Otra clase de fuerza para todo el cuerpo."),
    c(5, "Piernas y glúteos", "Fuerza", 28, "OC7ogdIK_lY", "Piernas fuertes y trabajo de glúteos.", "1 silla"),
    c(6, "Cardio HIIT: corazón fuerte y sano", "Cardio", 20, "fZF2kV69Y9Y", "Cardio por intervalos. Tené agua a mano y bajá el ritmo si hace falta."),
    c(7, "Flexibilidad y movilidad", "Movilidad", 10, "6DMVeFlpzBg", "Clase corta de flexibilidad y movilidad para cerrar tu primera semana."),
    c(8, "Brazos y abdomen", "Fuerza", 24, "JS1JDFMC3M0", "Fortalecé brazos y abdomen."),
    c(9, "Piernas y glúteos", "Fuerza", 29, "duNu-akO7zQ", "Fortalecé piernas y glúteos.", "1 silla y 1 toalla"),
    c(10, "Cardio HIIT: corazón y mente", "Cardio", 21, "WD_5oLnL2w0", "Cardio por intervalos. Tené agua a mano y bajá el ritmo si hace falta."),
    c(11, "Todo el cuerpo", "Fuerza", 21, "d4MxT2FTyYU", "Clase para fortalecer todo el cuerpo."),
    c(12, "Cuerpo fuerte y tonificado", "Fuerza", 26, "Mez-M6JbWxY", "Fortalecé y tonificá todo el cuerpo."),
    c(13, "Cardio HIIT: cuerpo y mente", "Cardio", 21, "pVFWYczIVJ8", "Cardio por intervalos. Tené agua a mano y bajá el ritmo si hace falta."),
    c(14, "Circulación y movilidad", "Movilidad", 10, "LGhqStVQYos", "Clase corta para mejorar la circulación. Llegaste a la mitad del reto."),
    c(15, "Cardio: corazón fuerte y mente sana", "Cardio", 22, "U8tuvp9gEt8", "Clase de cardio para activar el corazón y despejar la cabeza."),
    c(16, "Piernas y glúteos", "Fuerza", 28, "sd-5iXgvCo8", "Fortalecé y tonificá piernas y glúteos.", "1 libro grueso"),
    c(17, "Brazos, hombros y abdominales", "Fuerza", 23, "OfatxsSNeVc", "Trabajo de tren superior y centro: brazos, hombros y abdominales."),
    c(18, "Cardio y abdomen", "Cardio", 21, "SUpThy7syEA", "Cardio combinado con trabajo de abdomen."),
    c(19, "Cuerpo fuerte y tonificado", "Fuerza", 24, "P7yegpBWzHs", "Clase de fuerza para todo el cuerpo."),
    c(20, "Cardio HIIT: mente sana y cuerpo fuerte", "Cardio", 21, "fuUi-MDyn78", "Cardio por intervalos. Tené agua a mano y bajá el ritmo si hace falta."),
    c(21, "Flexibilidad y movilidad", "Movilidad", 8, "8R7Z5gFOGF4", "Clase corta para ganar flexibilidad y movilidad en articulaciones y músculos."),
    c(22, "Piernas y glúteos", "Fuerza", 29, "bbTURFSVs8Y", "Fortalecé y tonificá piernas y glúteos."),
    c(23, "Brazos, hombros y abdominales", "Fuerza", 25, "HQA_FmQqdxw", "Trabajo de tren superior y centro: brazos, hombros y abdominales."),
    c(24, "Cardio para todo el cuerpo", "Cardio", 21, "5tgUkTIjD74", "Cardio para activar y tonificar todo el cuerpo."),
    c(25, "Cardio: corazón saludable", "Cardio", 22, "2LTMF6LANyA", "Cardio para cuidar el corazón, despejar la mente y tonificar."),
    c(26, "Cuerpo fuerte y tonificado", "Fuerza", 26, "GUrrY_M8RLA", "Clase de fuerza para todo el cuerpo."),
    c(27, "Cardio y abdomen", "Cardio", 27, "pQkMkuwuz_A", "Cardio combinado con trabajo de abdomen."),
    c(28, "Flexibilidad y movilidad", "Movilidad", 10, "w4PphMwKbE4", "Última clase: flexibilidad y movilidad para cerrar tus 28 días."),
  ],
};

// "Rejuvenecé": 5 clases por semana. Semanas 1 y 2 repiten la rutina de fortalecimiento;
// semanas 3 y 4, la de quema de grasa.
const mes1: [string, number, string, string][] = [
  ["Piernas y glúteos", 13, "7O_6M5lkDrI", "Fortalecé piernas y glúteos en 13 minutos."],
  ["Abdomen y brazos", 14, "GLB2Y125P24", "Fortalecé abdomen y brazos en menos de 15 minutos."],
  ["Glúteos y abdomen", 13, "6Lepu7A3CHY", "Glúteos y abdomen fuertes en 13 minutos."],
  ["Abdomen y brazos", 14, "DOY-3wEeEto", "Otra rutina para abdomen y brazos, en menos de 15 minutos."],
  ["Piernas y glúteos", 13, "wwawtT9psbQ", "Cerrás la semana con piernas y glúteos."],
];
const mes2: [string, number, string, string][] = [
  ["Quema grasa: piernas y glúteos", 13, "Qj8DFqawnMw", "Rutina de quema de grasa con foco en piernas y glúteos."],
  ["Quema grasa: abdomen y brazos", 15, "Jdjpqc7qDJc", "Rutina de quema de grasa con foco en abdomen y brazos."],
  ["Quema grasa: todo el cuerpo", 15, "XtjTzPjko3g", "Rutina de quema de grasa para todo el cuerpo."],
  ["Quema grasa: abdomen, brazos y piernas", 13, "EkWUFjMp6eE", "Rutina de quema de grasa para abdomen, brazos y piernas."],
  ["Quema grasa: abdomen, piernas y glúteos", 14, "wZx0-adAUGY", "Cerrás la semana con abdomen, piernas y glúteos."],
];
const block = (start: number, rows: [string, number, string, string][], cat: Category) =>
  rows.map(([title, minutes, video, description], i) => c(start + i, title, cat, minutes, video, description));

const rejuvenece: Plan = {
  id: "rejuvenece",
  name: "Rejuvenecé y Adelgazá después de los 50",
  subtitle: "Quemá grasa y tonificá todo el cuerpo",
  perWeek: 5,
  // Incluido en la compra del reto (no se vende aparte): sin `addon`, queda abierto para todas.
  weeks: [
    { name: "Fortalecer", text: "Cinco rutinas cortas, de lunes a viernes." },
    { name: "Fortalecer", text: "Repetís las cinco rutinas. Vas a notar que salen mejor." },
    { name: "Quema grasa", text: "Cinco rutinas nuevas, con más ritmo." },
    { name: "Quema grasa", text: "Repetís las rutinas de quema de grasa y cerrás el plan." },
  ],
  classes: [...block(1, mes1, "Fuerza"), ...block(6, mes1, "Fuerza"), ...block(11, mes2, "Cardio"), ...block(16, mes2, "Cardio")],
};

export const plans: Plan[] = [pilates28, rejuvenece];
export const DEFAULT_PLAN = pilates28.id;
export const getPlan = (id: string): Plan => plans.find((p) => p.id === id) ?? pilates28;
/** Un plan adicional solo se puede usar si está activado en este dispositivo. */
export const canUsePlan = (plan: Plan, owned: string[]) => !plan.addon || owned.includes(plan.id);
export const getClass = (plan: Plan, day: number) => plan.classes.find((x) => x.day === day);
export const weekOf = (plan: Plan, day: number) => Math.min(plan.weeks.length, Math.ceil(day / plan.perWeek));
