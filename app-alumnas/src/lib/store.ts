"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TOTAL_DAYS } from "@/data/program";
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
  completions: Record<number, Completion>;
  energy: Record<string, Energy>;
  weights: { date: string; kg: number }[];
  favorites: string[];
  swaps: Record<string, number>;
  theme: "light" | "dark";
  chat: ChatMessage[];
  coachUse: { date: string; n: number };

  setProfile: (p: Profile) => void;
  completeDay: (day: number) => void;
  setFeeling: (day: number, f: Feeling) => void;
  uncompleteDay: (day: number) => void;
  setEnergy: (e: Energy) => void;
  addWeight: (kg: number) => void;
  removeWeight: (date: string) => void;
  toggleFavorite: (id: string) => void;
  swapMeal: (key: string) => void;
  toggleTheme: () => void;
  setChat: (c: ChatMessage[]) => void;
  countCoachUse: () => void;
  restartProgram: () => void;
  resetAll: () => void;
};

export const useApp = create<State>()(
  persist(
    (set) => ({
      profile: null,
      completions: {},
      energy: {},
      weights: [],
      favorites: [],
      swaps: {},
      theme: "light",
      chat: [],
      coachUse: { date: "", n: 0 },

      setProfile: (profile) => set({ profile }),
      completeDay: (day) =>
        set((s) => (s.completions[day] ? s : { completions: { ...s.completions, [day]: { date: dateKey() } } })),
      setFeeling: (day, feeling) =>
        set((s) => (s.completions[day] ? { completions: { ...s.completions, [day]: { ...s.completions[day], feeling } } } : s)),
      uncompleteDay: (day) =>
        set((s) => {
          const next = { ...s.completions };
          delete next[day];
          return { completions: next };
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
      restartProgram: () => set({ completions: {}, swaps: {} }),
      resetAll: () =>
        set({ profile: null, completions: {}, energy: {}, weights: [], favorites: [], swaps: {}, chat: [], coachUse: { date: "", n: 0 } }),
    }),
    { name: "pilates-lulu-app-v1", version: 1 },
  ),
);

/** Día que toca hoy: el primero sin completar (las clases se desbloquean en orden). */
export function currentDay(completions: Record<number, Completion>): number {
  for (let d = 1; d <= TOTAL_DAYS; d++) if (!completions[d]) return d;
  return TOTAL_DAYS;
}
export const doneCount = (c: Record<number, Completion>) => Object.keys(c).length;
export const isUnlocked = (day: number, c: Record<number, Completion>) => day === 1 || !!c[day] || !!c[day - 1];
