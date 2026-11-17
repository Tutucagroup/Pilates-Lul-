import { describe, expect, it } from "vitest";
import { computeStreak } from "./streak";

const T = "2026-11-20";
describe("computeStreak", () => {
  it("sin clases, racha 0", () => expect(computeStreak([], T).streak).toBe(0));
  it("cuenta días seguidos hasta hoy", () =>
    expect(computeStreak(["2026-11-18", "2026-11-19", "2026-11-20"], T).streak).toBe(3));
  it("hoy sin clase todavía no corta la racha", () =>
    expect(computeStreak(["2026-11-18", "2026-11-19"], T).streak).toBe(2));
  it("perdona un día libre por semana", () => {
    const r = computeStreak(["2026-11-16", "2026-11-17", "2026-11-19", "2026-11-20"], T);
    expect(r.streak).toBe(4);
    expect(r.freeDays).toEqual(["2026-11-18"]);
  });
  it("dos faltas en la misma semana cortan la racha", () =>
    expect(computeStreak(["2026-11-15", "2026-11-17", "2026-11-19", "2026-11-20"], T).streak).toBe(3));
  it("dos faltas seguidas cortan la racha", () =>
    expect(computeStreak(["2026-11-16", "2026-11-17"], T).streak).toBe(0));
  it("un día libre que no llega a una clase no cuenta como libre", () =>
    expect(computeStreak(["2026-11-20"], T)).toEqual({ streak: 1, freeDays: [] }));
});
