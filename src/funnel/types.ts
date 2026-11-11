/** Tipos del funnel. funnel.config.ts se valida contra estos tipos al compilar. */

export type AnswerValue = string | string[] | number;
export type Answers = Record<string, AnswerValue | undefined>;

export type Option = {
  id: string;
  label: string;
  emoji?: string;
  /** Ruta dentro de /public, p. ej. "/images/zona-abdomen.webp" */
  image?: string;
  /** Solo multi: al elegirla se desmarcan las demás (y viceversa). */
  exclusive?: boolean;
};

/** Condición declarativa: se cumple si la respuesta de `stepId` incluye alguno de `anyOf`. */
export type Condition = { stepId: string; anyOf: string[] };

/** Línea de aviso que aparece cuando se cumple la condición. */
export type Note = { when: Condition; text: string };

export type StepImage = { src: string; alt: string; width: number; height: number };

type StepBase = {
  /** Identificador estable: se usa en la URL (/q/[id]), en las respuestas y en el tracking. */
  id: string;
  /** Nombre legible para analytics (evento quiz_step). */
  name: string;
  /** Si existe y no se cumple, el paso se saltea. */
  showIf?: Condition;
  /**
   * Variantes A/B. "A" es siempre el paso tal como está definido.
   * Cada variante pisa los campos que indiques. `weight` reparte el tráfico
   * (A tiene peso implícito = `controlWeight`, por defecto 50).
   */
  variants?: Record<string, { weight: number; override: Partial<StepContent> }>;
  controlWeight?: number;
};

export type SingleStep = StepBase & {
  type: "single";
  title: string;
  subtitle?: string;
  label?: string;
  layout: "list" | "emoji" | "image";
  options: Option[];
  image?: StepImage;
  notes?: Note[];
};

export type MultiStep = StepBase & {
  type: "multi";
  title: string;
  subtitle?: string;
  layout: "list" | "image";
  options: Option[];
  cta: string;
};

export type InfoStep = StepBase & {
  type: "info";
  title: string;
  text: string;
  image?: StepImage;
  cta: string;
};

export type RulerStep = StepBase & {
  type: "ruler";
  title: string;
  subtitle?: string;
  measure: "height" | "weight";
  /** Límites y valor inicial SIEMPRE en métrico (cm / kg). */
  min: number;
  max: number;
  initial: number | { fromStep: string; offset: number; fallback: number };
  note?: string;
  /**
   * Validación opcional. "healthy-target": avisa si el peso elegido deja el IMC
   * por debajo de 18,5 para la altura respondida en `heightStep`.
   */
  check?: { type: "healthy-target"; heightStep: string };
  cta: string;
};

export type LoaderStep = StepBase & {
  type: "loader";
  title: string;
  messages: string[];
  durationMs: number;
};

export type ResultStep = StepBase & {
  type: "result";
  title: string;
  cta: string;
};

export type OfferStep = StepBase & {
  type: "offer";
};

export type Step =
  | SingleStep
  | MultiStep
  | InfoStep
  | RulerStep
  | LoaderStep
  | ResultStep
  | OfferStep;

export type StepType = Step["type"];

/** Campos de contenido que una variante A/B puede pisar. */
export type StepContent = {
  title: string;
  subtitle: string;
  label: string;
  text: string;
  cta: string;
  options: Option[];
  image: StepImage;
  layout: "list" | "emoji" | "image";
};

/* ---------- Oferta ---------- */

export type Benefit = {
  id: string;
  title: string;
  text: string;
  /** IDs de opciones que vuelven más relevante este beneficio (objetivo, zonas, etc.). */
  tags: string[];
};

export type Bonus = { title: string; text: string };
export type Faq = { q: string; a: string };

export type OfferContent = {
  headline: (s: PlanSummaryLike) => string;
  subheadline: (s: PlanSummaryLike) => string;
  howItWorks: { title: string; text: string }[];
  includes: string[];
  benefitsTitle: string;
  benefits: Benefit[];
  bonuses: Bonus[];
  faq: Faq[];
  cta: string;
  ctaSecondary: string;
  guaranteeText: (days: number) => string;
  /** Texto chico bajo el botón de compra. */
  checkoutNote: string;
};

/** Subconjunto del resumen del plan que usa la oferta (evita import circular). */
export type PlanSummaryLike = {
  goalLabel: string | null;
  zoneLabels: string[];
  levelLabel: string;
};

export type FunnelConfig = {
  steps: Step[];
  offer: OfferContent;
  /** Clave de localStorage. Cambiala si modificás mucho los pasos para no mezclar sesiones viejas. */
  storageKey: string;
};
