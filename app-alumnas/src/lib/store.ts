"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PLAN, getPlan, type Plan } from "@/data/program";
import { dateKey } from "./dates";
import type { Diet } from "./mealplan";

export type Goal = "tonificar" | "movilidad" | "espalda" | "energia";
export type Level = "nunca" | "algo" | "habitual";
export type Energy = "alta" | "normal" | "baja";
export type Feeling = "facil" | "justa" | "exigente";

export type Profile = { name: string; goal: Goal; level: Level; diet: Diet; cares: string[] };
export type Completion = { date: string; feeling?: Feeling };
export type ChatMessage = { role: "user" | "assistant"; content: string };

type State = {
  profile: Profile | null;
  /** Plan que la alumna está haciendo ahora. */
  activePlan: string;
  /** Clases hechas, por plan y por día. */
  completions: Record<string, Record<number, Completion>>;
  energy: Record<string, Energy>;
  weights: { date: string; kg: number }[];
  favorites: string[];
  swaps: Record<string, number>;
  theme: "light" | "dark";
  chat: ChatMessage[];
  coachUse: { date: string; n: number };

  setProfile: (p: Profile) => void;
  setActivePlan: (id: string) => void;
  completeDay: (plan: string, day: number) => void;
  setFeeling: (plan: string, day: number, f: Feeling) => void;
  uncompleteDay: (plan: string, day: number) => void;
  setEnergy: (e: Energy) => void;
  addWeight: (kg: number) => void;
  removeWeight: (date: string) => void;
  toggleFavorite: (id: string) => void;
  swapMeal: (key: string) => void;
  toggleTheme: () => void;
  setChat: (c: ChatMessage[]) => void;
  countCoachUse: () => void;
  restartProgram: (plan: string) => void;
  resetAll: () => void;
};

export const useApp = create<State>()(
  persist(
    (set) => ({
      profile: null,
      activePlan: DEFAULT_PLAN,
      completions: {},
      energy: {},
      weights: [],
      favorites: [],
      swaps: {},
      theme: "light",
      chat: [],
      coachUse: { date: "", n: 0 },

      setProfile: (profile) => set({ profile }),
      setActivePlan: (activePlan) => set({ activePlan }),
      completeDay: (plan, day) =>
        set((s) => {
          const cur = s.completions[plan] ?? {};
          return cur[day] ? s : { completions: { ...s.completions, [plan]: { ...cur, [day]: { date: dateKey() } } } };
        }),
      setFeeling: (plan, day, feeling) =>
        set((s) => {
          const cur = s.completions[plan] ?? {};
          return cur[day] ? { completions: { ...s.completions, [plan]: { ...cur, [day]: { ...cur[day], feeling } } } } : s;
        }),
      uncompleteDay: (plan, day) =>
        set((s) => {
          const cur = { ...(s.completions[plan] ?? {}) };
          delete cur[day];
          return { completions: { ...s.completions, [plan]: cur } };
        }),
      setEnergy: (e) => set((s) => ({ energy: { ...s.energy, [dateKey()]: e } })),
      addWeight: (kg) =>
        set((s) => {
          const date = dateKey();
          return { weights: [...s.weights.filter((w) => w.date !== date), { date, kg }].sort((a, b) => a.date.localeCompare(b.date)) };
        }),
      removeWeight: (date) => set((s) => ({ weights: s.weights.filter((w) => w.date !== date) })),
      toggleFavorite: (id) =>
        set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
      swapMeal: (key) => set((s) => ({ swaps: { ...s.swaps, [key]: (s.swaps[key] ?? 0) + 1 } })),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
      setChat: (chat) => set({ chat: chat.slice(-40) }),
      countCoachUse: () =>
        set((s) => {
          const today = dateKey();
          return { coachUse: { date: today, n: s.coachUse.date === today ? s.coachUse.n + 1 : 1 } };
        }),
      restartProgram: (plan) => set((s) => ({ completions: { ...s.completions, [plan]: {} }, swaps: {} })),
      resetAll: () =>
        set({ profile: null, activePlan: DEFAULT_PLAN, completions: {}, energy: {}, weights: [], favorites: [], swaps: {}, chat: [], coachUse: { date: "", n: 0 } }),
    }),
    {
      name: "pilates-lulu-app-v1",
      version: 2,
      // v1 guardaba las clases hechas de un solo plan.
      migrate: (old, version) => {
        const state = old as Record<string, unknown>;
        if (version < 2) return { ...state, activePlan: DEFAULT_PLAN, completions: { [DEFAULT_PLAN]: state.completions ?? {} } };
        return state;
      },
    },
  ),
);

type Done = Record<number, Completion>;
const EMPTY: Done = {};

/** Plan activo y sus clases hechas. */
export function useActivePlan(): { plan: Plan; done: Done } {
  const id = useApp((s) => s.activePlan);
  const done = useApp((s) => s.completions[id] ?? EMPTY);
  return { plan: getPlan(id), done };
}

/** Fechas con al menos una clase hecha, en cualquier plan. */
export function allDoneDates(completions: Record<string, Done>): string[] {
  return Object.values(completions).flatMap((d) => Object.values(d).map((c) => c.date));
}

/** Día que toca: el primero sin completar (las clases se desbloquean en orden). */
export function currentDay(plan: Plan, done: Done): number {
  for (const c of plan.classes) if (!done[c.day]) return c.day;
  return plan.classes.length;
}
export const doneCount = (done: Done) => Object.keys(done).length;
export const isUnlocked = (day: number, done: Done) => day === 1 || !!done[day] || !!done[day - 1];
