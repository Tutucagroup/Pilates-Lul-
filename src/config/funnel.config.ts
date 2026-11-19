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

const { program, includedProgram } = brand;

export const funnel: FunnelConfig = {
  storageKey: "pilates-lulu-quiz-v2",

  steps: [
    {
      id: "kilos",
      name: "Kilos a bajar",
      type: "single",
      layout: "emoji",
      label: "CUESTIONARIO DE 1 MINUTO",
      title: "¿Cuántos kilos te gustaría bajar?",
      subtitle: `${brand.tagline}. Respondé 5 preguntas y armamos tu plan.`,
      image: {
        src: "/images/hero.webp",
        alt: "Mujer haciendo un estiramiento suave en el living de su casa",
        width: 1024,
        height: 1280,
      },
      options: [
        { id: "1-3", label: "De 1 a 3 kg", emoji: "✨" },
        { id: "4-6", label: "De 4 a 6 kg", emoji: "💪" },
        { id: "7-10", label: "De 7 a 10 kg", emoji: "🔥" },
        { id: "11-14", label: "De 11 a 14 kg", emoji: "⚡" },
        { id: "15+", label: "Más de 15 kg", emoji: "🎯" },
      ],
      // Ejemplo de test A/B listo para activar: descomentá y ajustá.
      // variants: {
      //   B: { weight: 50, override: { subtitle: "Respondé 1 minuto y te mostramos tu plan" } },
      // },
    },
    {
      id: "molestias",
      name: "Dónde siente molestias",
      type: "single",
      layout: "emoji",
      title: "¿Dónde sentís más molestia al moverte?",
      subtitle: "Elegí una opción para adaptar tu plan",
      options: [
        { id: "rodillas", label: "Rodillas", emoji: "🦵" },
        { id: "cadera", label: "Cadera", emoji: "🦴" },
        { id: "espalda", label: "Espalda o cintura", emoji: "🔙" },
        { id: "pies", label: "Pies o tobillos", emoji: "🦶" },
        { id: "ninguna", label: "No tengo molestias", emoji: "🙌" },
      ],
    },
    {
      id: "edad",
      name: "Edad",
      type: "single",
      layout: "emoji",
      title: "¿Cuántos años tenés?",
      options: [
        { id: "40-49", label: "De 40 a 49", emoji: "🌸" },
        { id: "50-54", label: "De 50 a 54", emoji: "💫" },
        { id: "55-59", label: "De 55 a 59", emoji: "🌟" },
        { id: "60-64", label: "De 60 a 64", emoji: "✨" },
        { id: "65+", label: "65 o más", emoji: "👑" },
      ],
    },
    {
      id: "cuerpo",
      name: "Cómo describe su cuerpo",
      type: "single",
      layout: "image",
      title: "¿Cómo describirías tu cuerpo hoy?",
      options: [
        { id: "regular", label: "Regular", emoji: "🙂", image: "/images/cuerpo-firmeza.webp" },
        { id: "flacido", label: "Flácido", emoji: "🌀", image: "/images/cuerpo-panza.webp" },
        { id: "sobrepeso", label: "Sobrepeso", emoji: "💗", image: "/images/cuerpo-kilos.webp" },
      ],
    },
    {
      id: "zonas",
      name: "Zonas a trabajar",
      type: "multi",
      layout: "image",
      title: "¿Qué zonas querés trabajar más?",
      subtitle: "Podés marcar más de una",
      options: [
        { id: "abdomen", label: "Abdomen", emoji: "🔻", image: "/images/zona-abdomen.webp" },
        { id: "cintura", label: "Cintura", emoji: "⏳", image: "/images/zona-cintura.webp" },
        { id: "piernas", label: "Piernas", emoji: "🦵", image: "/images/zona-piernas.webp" },
        { id: "cola", label: "Cola", emoji: "🍑", image: "/images/zona-cola.webp" },
        { id: "espalda", label: "Espalda", emoji: "🔙", image: "/images/zona-espalda.webp" },
        { id: "brazos", label: "Brazos", emoji: "💪", image: "/images/zona-brazos.webp" },
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
      durationMs: 3000,
    },
    {
      id: "resultado",
      name: "Resultado",
      type: "result",
      title: "Tu plan está listo",
      // Botón de arriba: va directo al checkout de Impultienda.
      cta: "Ver mi plan",
    },
  ],

  offer: {
    headline: (s) =>
      s.goalLabel
        ? `Tu ${program.name.toLowerCase()} para ${s.goalLabel.toLowerCase()}`
        : `Tu ${program.name.toLowerCase()} de ${brand.method}`,
    subheadline: (s) => {
      const zonas = s.zoneLabels.length
        ? `, con foco en ${joinEs(s.zoneLabels.map((z) => z.toLowerCase()))}`
        : "";
      const cuidado = s.careText ? `, cuidando ${s.careText}` : "";
      return `Nivel ${s.levelLabel.toLowerCase()}${zonas}${cuidado}. ${program.minutesPerDay} minutos por día, en tu casa.`;
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
      `${program.days} clases guiadas en video de ${program.minutesPerDay} minutos (${program.name})`,
      `${includedProgram.classes} clases más del programa «${includedProgram.name}»: ${includedProgram.tagline.toLowerCase()}`,
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
        tags: ["abdomen", "cintura", "flacido"],
      },
      {
        id: "movilidad",
        title: "Movilidad y articulaciones",
        text: "Movimientos lentos que ayudan a moverte con más soltura en el día a día.",
        tags: ["rodillas", "cadera", "pies"],
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
        tags: ["piernas", "cola", "flacido"],
      },
      {
        id: "brazos",
        title: "Brazos",
        text: "Secuencias de brazos con el peso de tu cuerpo, sin pesas.",
        tags: ["brazos", "flacido"],
      },
      {
        id: "peso",
        title: "Un hábito diario que suma",
        text: "Moverte todos los días es un buen aliado si querés bajar de peso, junto con la alimentación y el descanso.",
        tags: ["sobrepeso", "7-10", "11-14", "15+"],
      },
      {
        id: "energia",
        title: "Más energía",
        text: "Rutinas cortas que se pueden sostener, para terminar el día menos cansada.",
        tags: [],
      },
      {
        id: "calma",
        title: "Calma y descanso",
        text: "Respiración y movimiento consciente para bajar un cambio.",
        tags: [],
      },
      {
        id: "equilibrio",
        title: "Equilibrio",
        text: "Ejercicios de estabilidad para sentirte más segura al moverte.",
        tags: ["65+"],
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
        q: "¿Qué incluye la compra?",
        a: `Los 2 programas, en un solo pago: el ${program.name} de ${brand.method} (${program.days} clases) y «${includedProgram.name}» (${includedProgram.classes} clases, ${includedProgram.perWeek} por semana durante ${includedProgram.weeks} semanas). Los dos quedan en tu app desde el primer día.`,
      },
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
        a: `Tenés ${brand.guarantee.days} días de garantía: si no te convence, escribinos${brand.supportEmail ? ` a ${brand.supportEmail}` : ""} y te devolvemos el dinero.`,
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

