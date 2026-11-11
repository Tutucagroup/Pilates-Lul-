"use client";
/**
 * Tracking del lado del cliente.
 * Cada evento de Meta se manda dos veces con el MISMO event_id:
 *  1) Pixel (navegador)   2) Conversions API (servidor, /api/meta)
 * Meta deduplica por event_name + event_id.
 */
import { brand } from "@/config/brand.config";
import { useQuiz, newSessionId } from "@/funnel/store";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const pixelEnabled = Boolean(brand.meta.pixelId);

export function newEventId(prefix: string): string {
  return `${prefix}_${newSessionId()}`;
}

const STANDARD = new Set(["PageView", "Lead", "InitiateCheckout", "ViewContent", "Purchase"]);

export function trackMeta(eventName: string, customData: Record<string, unknown> = {}, eventId = newEventId(eventName)) {
  if (!pixelEnabled) return eventId;
  if (typeof window !== "undefined" && window.fbq) {
    const method = STANDARD.has(eventName) ? "track" : "trackCustom";
    window.fbq(method, eventName, customData, { eventID: eventId });
  }
  const { sessionId } = useQuiz.getState();
  void post("/api/meta", {
    eventName,
    eventId,
    eventSourceUrl: typeof location !== "undefined" ? location.href : undefined,
    customData,
    sessionId,
  });
  return eventId;
}

export type QuizEvent = {
  event: "view" | "answer" | "result" | "checkout";
  stepId: string;
  stepIndex: number;
  stepName: string;
  variant?: string;
  value?: unknown;
};

/** Guarda respuestas y avance por paso en Supabase (vía /api/quiz). */
export function logQuizEvent(e: QuizEvent) {
  const s = useQuiz.getState();
  if (!s.sessionId) return;
  void post("/api/quiz", {
    ...e,
    sessionId: s.sessionId,
    answers: s.answers,
    attribution: s.attribution,
    variants: s.variants,
  });
}

function post(url: string, body: unknown) {
  return fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => undefined);
}
