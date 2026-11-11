"use client";
/**
 * Estado del quiz (Zustand) persistido en localStorage para poder retomar.
 * `skipHydration` evita diferencias entre el HTML del servidor y el cliente:
 * QuizBoot llama a rehydrate() una vez montado.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { funnel } from "@/config/funnel.config";
import type { Attribution } from "@/lib/checkout";
import type { HeightUnit, WeightUnit } from "@/lib/units";
import type { AnswerValue, Answers } from "./types";

type QuizState = {
  hydrated: boolean;
  sessionId: string;
  startedAt: string | null;
  answers: Answers;
  units: { height: HeightUnit; weight: WeightUnit };
  /** Variante A/B asignada por paso (se fija la primera vez que se ve el paso). */
  variants: Record<string, string>;
  attribution: Attribution;
  /** Último paso visto (para "retomar"). */
  lastStepId: string | null;
  /** Eventos one-shot ya enviados (Lead, etc.). */
  sent: Record<string, boolean>;

  setAnswer: (stepId: string, value: AnswerValue) => void;
  setLastStep: (stepId: string) => void;
  setUnit: (kind: "height" | "weight", unit: HeightUnit | WeightUnit) => void;
  setVariant: (stepId: string, variant: string) => void;
  mergeAttribution: (a: Attribution) => void;
  markSent: (key: string) => void;
  reset: () => void;
};

const initial = {
  hydrated: false,
  sessionId: "",
  startedAt: null,
  answers: {},
  units: { height: "cm" as HeightUnit, weight: "kg" as WeightUnit },
  variants: {},
  attribution: {},
  lastStepId: null,
  sent: {},
};

export function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useQuiz = create<QuizState>()(
  persist(
    (set) => ({
      ...initial,
      setAnswer: (stepId, value) => set((s) => ({ answers: { ...s.answers, [stepId]: value } })),
      setLastStep: (stepId) => set({ lastStepId: stepId }),
      setUnit: (kind, unit) => set((s) => ({ units: { ...s.units, [kind]: unit } })),
      setVariant: (stepId, variant) => set((s) => ({ variants: { ...s.variants, [stepId]: variant } })),
      // La primera atribución con datos gana; un clic nuevo con UTM distintas la reemplaza.
      mergeAttribution: (a) =>
        set((s) => (Object.keys(a).length ? { attribution: { ...a } } : { attribution: s.attribution })),
      markSent: (key) => set((s) => ({ sent: { ...s.sent, [key]: true } })),
      reset: () =>
        set({
          ...initial,
          hydrated: true,
          sessionId: newSessionId(),
          startedAt: new Date().toISOString(),
        }),
    }),
    {
      name: funnel.storageKey,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        sessionId: s.sessionId,
        startedAt: s.startedAt,
        answers: s.answers,
        units: s.units,
        variants: s.variants,
        attribution: s.attribution,
        lastStepId: s.lastStepId,
        sent: s.sent,
      }),
    },
  ),
);
