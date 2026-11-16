import { addDays } from "./dates";

/**
 * Racha de práctica con 1 día libre por semana.
 *
 * Se cuenta hacia atrás desde hoy. Cada día con clase suma 1. Un día sin clase se
 * perdona si en los 6 días anteriores a él no se usó otro día libre; si no, la racha
 * se corta ahí. Hoy sin clase todavía no cuenta como falta.
 */
export function computeStreak(doneDates: Iterable<string>, today: string): { streak: number; freeDays: string[] } {
  const done = new Set(doneDates);
  if (done.size === 0) return { streak: 0, freeDays: [] };

  let cursor = done.has(today) ? today : addDays(today, -1);
  let streak = 0;
  let lastFree: string | null = null;
  const freeDays: string[] = [];
  const pending: string[] = [];

  for (let i = 0; i < 400; i++) {
    if (done.has(cursor)) {
      streak++;
      freeDays.push(...pending.splice(0));
    } else {
      // ¿Hay un día libre usado dentro de los 6 días posteriores (ya recorridos)?
      const tooClose = lastFree !== null && lastFree <= addDays(cursor, 6);
      if (tooClose) break;
      lastFree = cursor;
      pending.push(cursor);
    }
    cursor = addDays(cursor, -1);
  }
  return { streak, freeDays };
}
