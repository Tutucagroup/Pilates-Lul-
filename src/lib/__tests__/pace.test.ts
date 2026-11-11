import { describe, expect, it } from "vitest";
import { estimatePace, MAX_KG_PER_WEEK, MIN_KG_PER_WEEK } from "../rules/pace";

const start = new Date("2026-01-01T00:00:00Z");

describe("pace", () => {
  it("proyecta entre 0,5 y 1 kg por semana", () => {
    const p = estimatePace(160, 70, 65, start);
    expect(p.status).toBe("ok");
    expect(p.weeksFast).toBe(5);
    expect(p.weeksSlow).toBe(10);
    expect(p.targetDateSlow).toBe("2026-03-12");
    expect(p.targetDateFast).toBe("2026-02-05");
  });
  it("nunca supera 1 kg/semana en la curva", () => {
    const p = estimatePace(165, 95, 70, start);
    for (let i = 1; i < p.points.length; i++) {
      const drop = p.points[i - 1].kg - p.points[i].kg;
      expect(drop).toBeLessThanOrEqual(MAX_KG_PER_WEEK);
      expect(drop).toBeLessThanOrEqual(MIN_KG_PER_WEEK + 1e-9);
    }
    expect(p.points.at(-1)?.kg).toBe(70);
  });
  it("no promete fecha si el objetivo deja el IMC por debajo de 18,5", () => {
    const p = estimatePace(160, 60, 45, start);
    expect(p.status).toBe("unhealthy-target");
    expect(p.targetDateSlow).toBeNull();
    expect(p.points).toHaveLength(0);
  });
  it("si el objetivo es mantener o subir, no proyecta bajada", () => {
    expect(estimatePace(160, 60, 60, start).status).toBe("maintain");
    expect(estimatePace(160, 60, 64, start).status).toBe("maintain");
  });
  it("datos inválidos", () => {
    expect(estimatePace(0, 60, 55, start).status).toBe("invalid");
  });
});
