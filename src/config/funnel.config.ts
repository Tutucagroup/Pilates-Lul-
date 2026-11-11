/**
 * funnel.config.ts — define TODO el funnel: pasos, textos, opciones, imágenes,
 * reglas condicionales, variantes A/B y el contenido de la página de oferta.
 *
 * Para cambiar el funnel NO hace falta tocar componentes:
 *  - Reordenar pasos: mové objetos dentro de `steps`.
 *  - Cambiar textos/opciones: editá el paso.
 *  - Saltear un paso según una respuesta: `showIf: { stepId, anyOf: [...] }`.
 *  - Mostrar una línea de aviso: `notes: [{ when: {...}, text }]` (pasos single).
 *  - Test A/B: `variants: { B: { weight: 50, override: { title: "..." } } }`.
 *
 * Los IDs de pasos y opciones se usan en las reglas (src/lib/rules) y en Supabase:
 * si cambiás un ID, revisá las reglas.
 *
 * Español rioplatense con voseo, siempre.
 */
import { brand } from "./brand.config";
import type { FunnelConfig } from "@/funnel/types";
import { joinEs } from "@/lib/format";

const { program } = brand;

export const funnel: FunnelConfig = {
  storageKey: "pilates-lulu-quiz-v1",

  steps: [
    {
      id: "edad",
      name: "Edad",
      type: "single",
      layout: "list",
      title: brand.tagline,
      subtitle: "Contanos tu edad y armamos tu plan",
      label: "CUESTIONARIO DE 1 MINUTO",
      image: {
        src: "/images/hero.webp",
        alt: "Mujer haciendo un estiramiento suave en el living de su casa",
        width: 1024,
        height: 1280,
      },
      options: [
        { id: "40-49", label: "40-49" },
        { id: "50-59", label: "50-59" },
        { id: "60-69", label: "60-69" },
        { id: "70+", label: "70+" },
      ],
      // Ejemplo de test A/B listo para activar: descomentá y ajustá.
      // variants: {
      //   B: { weight: 50, override: { subtitle: "Respondé 1 minuto y te mostramos tu plan" } },
      // },
    },
    {
      id: "no-estas-sola",
      name: "Info: no estás sola",
      type: "info",
      title: "No estás sola",
      text: "Muchas mujeres empiezan desde cero, igual que vos.",
      image: {
        src: "/images/no-estas-sola.webp",
        alt: "Tres mujeres estirando juntas en un living",
        width: 1024,
        height: 768,
      },
      cta: "Continuar",
    },
    {
      id: "objetivo",
      name: "Objetivo principal",
      type: "single",
      layout: "emoji",
      title: "¿Cuál es tu objetivo principal?",
      options: [
        { id: "peso", label: "Bajar de peso", emoji: "⚖️" },
        { id: "movilidad", label: "Ganar movilidad y aliviar molestias", emoji: "🌿" },
        { id: "tonificar", label: "Tonificar y reducir medidas", emoji: "✨" },
      ],
    },
    {
      id: "quince-minutos",
      name: "Info: 15 minutos",
      type: "info",
      title: `Con ${program.minutesPerDay} minutos por día alcanza`,
      text: "Movimientos lentos y de bajo impacto, pensados para tu edad. Sin saltos, sin equipos y sin gimnasio.",
      image: {
        src: "/images/quince-minutos.webp",
        alt: "Mujer estirando sentada sobre un mat, con una taza de té al lado",
        width: 1024,
        height: 768,
      },
      cta: "Continuar",
    },
    {
      id: "mejorar",
      name: "Qué más mejorar",
      type: "multi",
      layout: "list",
      title: "¿Qué más te gustaría mejorar?",
      subtitle: "Podés elegir varias",
      options: [
        { id: "energia", label: "Más energía", emoji: "⚡" },
        { id: "sueno", label: "Dormir mejor", emoji: "🌙" },
        { id: "estres", label: "Menos estrés", emoji: "🍃" },
        { id: "postura", label: "Mejor postura", emoji: "🧍‍♀️" },
        { id: "flexibilidad", label: "Más flexibilidad", emoji: "🤸‍♀️" },
        { id: "equilibrio", label: "Mejor equilibrio", emoji: "⚖️" },
      ],
      cta: "Continuar",
    },
    {
      id: "zonas",
      name: "Zonas a trabajar",
      type: "multi",
      layout: "image",
      title: "¿Qué zonas querés trabajar?",
      subtitle: "Podés elegir varias",
      options: [
        { id: "abdomen", label: "Abdomen", image: "/images/zona-abdomen.webp" },
        { id: "brazos", label: "Brazos", image: "/images/zona-brazos.webp" },
        { id: "piernas", label: "Piernas y glúteos", image: "/images/zona-piernas.webp" },
        { id: "espalda", label: "Espalda y postura", image: "/images/zona-espalda.webp" },
        { id: "todo", label: "Todo el cuerpo", image: "/images/zona-todo.webp" },
      ],
      cta: "Continuar",
    },
    {
      id: "cuerpo",
      name: "Cómo se siente con su cuerpo",
      type: "single",
      layout: "image",
      title: "¿Cómo te sentís hoy con tu cuerpo?",
      options: [
        { id: "firmeza", label: "Bien, quiero más firmeza", image: "/images/cuerpo-firmeza.webp" },
        { id: "panza", label: "Peso normal, pero con panza", image: "/images/cuerpo-panza.webp" },
        { id: "kilos", label: "Tengo kilos de más", image: "/images/cuerpo-kilos.webp" },
      ],
    },
    {
      id: "lograr",
      name: "Qué quiere lograr",
      type: "single",
      layout: "list",
      title: "¿Qué te gustaría lograr?",
      options: [
        { id: "liviana", label: "Sentirme liviana" },
        { id: "tonificada", label: "Verme tonificada" },
        { id: "sin-dolor", label: "Moverme sin dolor" },
        { id: "figura", label: "Recuperar mi figura" },
        { id: "activa", label: "Mantenerme activa" },
      ],
    },
    {
      id: "inactividad",
      name: "Tiempo sin actividad",
      type: "single",
      layout: "list",
      title: "¿Hace cuánto que no hacés actividad física regular?",
      options: [
        { id: "lt6m", label: "Menos de 6 meses" },
        { id: "1-2y", label: "1 a 2 años" },
        { id: "3y+", label: "Más de 3 años" },
        { id: "nunca", label: "Nunca hice" },
      ],
    },
    {
      id: "pensado-para-vos",
      name: "Info: pensado para vos",
      type: "info",
      title: "Este método está pensado para vos",
      text: "Es suave, progresivo y se adapta a tu ritmo. Empezás desde donde estás hoy.",
      image: {
        src: "/images/metodo.webp",
        alt: "Mujer haciendo un movimiento lento de brazos en su casa",
        width: 1024,
        height: 768,
      },
      cta: "Continuar",
    },
    {
      id: "sensacion",
      name: "Sensación al hacer ejercicio",
      type: "single",
      layout: "list",
      title: "¿Cómo te sentís al hacer ejercicio?",
      options: [
        { id: "molestias", label: "Tengo molestias en articulaciones o espalda" },
        { id: "cansancio", label: "Me canso rápido" },
        { id: "bien", label: "Me muevo bien" },
      ],
      notes: [
        {
          when: { stepId: "sensacion", anyOf: ["molestias"] },
          text: "Si tenés una lesión o condición médica, consultá con tu médico antes de empezar.",
        },
      ],
    },
    {
      id: "altura",
      name: "Altura",
      type: "ruler",
      measure: "height",
      title: "¿Cuánto medís?",
      min: 140,
      max: 200,
      initial: 160,
      cta: "Continuar",
    },
    {
      id: "peso",
      name: "Peso actual",
      type: "ruler",
      measure: "weight",
      title: "¿Cuál es tu peso actual?",
      min: 40,
      max: 150,
      initial: 70,
      note: "Tus datos son privados y solo se usan para armar tu plan.",
      cta: "Continuar",
    },
    {
      id: "peso-objetivo",
      name: "Peso objetivo",
      type: "ruler",
      measure: "weight",
      title: "¿Cuál es tu peso objetivo?",
      min: 40,
      max: 150,
      initial: { fromStep: "peso", offset: -5, fallback: 65 },
      check: { type: "healthy-target", heightStep: "altura" },
      cta: "Continuar",
    },
    {
      id: "valoras",
      name: "Qué valora en un programa",
      type: "multi",
      layout: "list",
      title: "¿Qué valorás más en un programa?",
      subtitle: "Podés elegir varias",
      options: [
        { id: "suaves", label: "Ejercicios suaves y adaptados" },
        { id: "explicacion", label: "Que me expliquen bien cada movimiento" },
        { id: "casa", label: "Poder hacerlo en casa" },
        { id: "acompanamiento", label: "Acompañamiento" },
      ],
      cta: "Continuar",
    },
    {
      id: "sintomas",
      name: "Síntomas",
      type: "multi",
      layout: "list",
      title: "¿Te pasa algo de esto?",
      subtitle: "Podés elegir varias",
      options: [
        { id: "duermo-mal", label: "Duermo mal" },
        { id: "cansancio", label: "Cansancio" },
        { id: "humor", label: "Cambios de humor" },
        { id: "dolor-articular", label: "Dolor articular" },
        { id: "aumento-peso", label: "Aumento de peso" },
        { id: "suelo-pelvico", label: "Suelo pélvico" },
        { id: "ninguna", label: "Ninguna", exclusive: true },
      ],
      cta: "Continuar",
    },
    {
      id: "armando",
      name: "Loader",
      type: "loader",
      title: "Armando tu plan…",
      messages: [
        "Analizando tus respuestas",
        "Eligiendo tu nivel",
        `Ordenando tus ${program.days} días`,
      ],
      durationMs: 5000,
    },
    {
      id: "resultado",
      name: "Resultado",
      type: "result",
      title: "Tu plan está listo",
      cta: "Ver mi plan",
    },
    {
      id: "oferta",
      name: "Oferta",
      type: "offer",
    },
  ],

  offer: {
    headline: (s) =>
      s.goalLabel
        ? `Tu ${program.name.toLowerCase()} para ${s.goalLabel.toLowerCase()}`
        : `Tu ${program.name.toLowerCase()} de ${brand.method}`,
    subheadline: (s) => {
      const zonas = s.zoneLabels.length
        ? ` con foco en ${joinEs(s.zoneLabels.map((z) => z.toLowerCase()))}`
        : "";
      return `Nivel ${s.levelLabel.toLowerCase()}${zonas}. ${program.minutesPerDay} minutos por día, en tu casa.`;
    },

    howItWorks: [
      { title: "Respondiste el cuestionario", text: "Con tus respuestas elegimos tu nivel y el foco de tu plan." },
      {
        title: `${program.minutesPerDay} minutos por día`,
        text: "Abrís la clase del día desde el celular y la hacés en casa, a tu ritmo.",
      },
      {
        title: `${program.days} días progresivos`,
        text: "Cada semana suma un poco más, sin saltos ni movimientos bruscos.",
      },
    ],

    // ⚠️ Revisá que esta lista coincida EXACTAMENTE con lo que entregás.
    includes: [
      `${program.days} clases guiadas en video de ${program.minutesPerDay} minutos`,
      "Calendario día por día para no tener que pensar qué hacer",
      "Explicación clara de cada movimiento, con opciones más suaves",
      "Acceso desde el celular, la tablet o la computadora",
      "Acceso inmediato por email después del pago",
    ],

    benefitsTitle: "Lo que vas a trabajar",
    benefits: [
      {
        id: "abdomen",
        title: "Abdomen y centro del cuerpo",
        text: "Ejercicios de activación profunda para ganar firmeza en la zona media.",
        tags: ["abdomen", "tonificar", "panza", "tonificada", "figura", "suelo-pelvico"],
      },
      {
        id: "movilidad",
        title: "Movilidad y articulaciones",
        text: "Movimientos lentos que ayudan a moverte con más soltura en el día a día.",
        tags: ["movilidad", "sin-dolor", "molestias", "dolor-articular", "flexibilidad"],
      },
      {
        id: "postura",
        title: "Espalda y postura",
        text: "Trabajo de espalda para pararte más derecha y con menos tensión.",
        tags: ["espalda", "postura"],
      },
      {
        id: "piernas",
        title: "Piernas y glúteos",
        text: "Fuerza suave en piernas y glúteos, sin saltos ni impacto.",
        tags: ["piernas", "tonificar", "figura", "tonificada"],
      },
      {
        id: "brazos",
        title: "Brazos",
        text: "Secuencias de brazos con el peso de tu cuerpo, sin pesas.",
        tags: ["brazos", "tonificada"],
      },
      {
        id: "peso",
        title: "Un hábito diario que suma",
        text: "Moverte todos los días es un buen aliado si querés bajar de peso, junto con la alimentación y el descanso.",
        tags: ["peso", "kilos", "liviana", "aumento-peso"],
      },
      {
        id: "energia",
        title: "Más energía",
        text: "Rutinas cortas que se pueden sostener, para terminar el día menos cansada.",
        tags: ["energia", "cansancio", "activa"],
      },
      {
        id: "calma",
        title: "Calma y descanso",
        text: "Respiración y movimiento consciente para bajar un cambio.",
        tags: ["sueno", "duermo-mal", "estres", "humor"],
      },
      {
        id: "equilibrio",
        title: "Equilibrio",
        text: "Ejercicios de estabilidad para sentirte más segura al moverte.",
        tags: ["equilibrio"],
      },
    ],

    // ⚠️ Los bonos tienen que existir de verdad. Si no los tenés, dejá el array vacío
    // y la sección no se muestra.
    bonuses: [
      { title: "Rutinas express de 5 minutos", text: "Para los días en que no te alcanza el tiempo." },
      { title: "Guía de respiración", text: "Ejercicios de respiración para empezar y terminar cada clase." },
    ],

    faq: [
      {
        q: "¿Necesito experiencia previa?",
        a: "No. El plan arranca desde cero y cada movimiento tiene una opción más suave.",
      },
      {
        q: "¿Necesito equipos o ir a un gimnasio?",
        a: "No. Solo un espacio en tu casa y, si tenés, un mat o una alfombra.",
      },
      {
        q: "¿Cuánto tiempo por día lleva?",
        a: `Unos ${program.minutesPerDay} minutos por día durante ${program.days} días.`,
      },
      {
        q: "¿Cómo recibo el acceso?",
        a: "Apenas se confirma el pago te llega un email con el acceso. Revisá también la carpeta de spam o promociones.",
      },
      {
        q: "¿Lo puedo hacer si tengo una lesión o una condición médica?",
        a: "Consultá con tu médico antes de empezar. El programa no reemplaza una indicación médica ni kinesiológica.",
      },
      {
        q: "¿Qué pasa si no me gusta?",
        a: `Tenés ${brand.guarantee.days} días de garantía: si no te convence, escribinos a ${brand.supportEmail} y te devolvemos el dinero.`,
      },
      {
        q: "¿Cómo puedo pagar?",
        a: "El pago se hace en el checkout seguro de nuestra tienda, con los medios de pago disponibles ahí.",
      },
    ],

    cta: "Quiero empezar mi reto",
    ctaSecondary: "Quiero empezar mi reto",
    guaranteeText: (days) =>
      `Probalo ${days} días. Si no es para vos, te devolvemos el 100% de tu dinero. Sin preguntas incómodas.`,
    checkoutNote: "Pago seguro. Acceso inmediato por email.",
  },
};

