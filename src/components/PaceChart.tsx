import type { Pace } from "@/lib/rules/pace";
import { formatDateEs } from "@/lib/format";

/** Gráfico simple (SVG) del ritmo prudente hacia el peso objetivo. */
export function PaceChart({ pace }: { pace: Pace }) {
  if (pace.status !== "ok" || pace.points.length < 2) return null;
  const W = 320, H = 150, P = { l: 8, r: 8, t: 26, b: 28 };
  const max = pace.currentKg, min = pace.targetKg;
  const span = Math.max(1, max - min);
  const last = pace.points.length - 1;
  const x = (w: number) => P.l + (w / last) * (W - P.l - P.r);
  const y = (kg: number) => P.t + ((max - kg) / span) * (H - P.t - P.b);
  const d = pace.points.map((p, i) => `${i ? "L" : "M"}${x(p.week).toFixed(1)},${y(p.kg).toFixed(1)}`).join(" ");
  const area = `${d} L${x(last)},${H - P.b} L${x(0)},${H - P.b} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`Estimación: de ${pace.currentKg} kg a ${pace.targetKg} kg en unas ${pace.weeksFast} a ${pace.weeksSlow} semanas`}
    >
      <defs>
        <linearGradient id="pace-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--color-brand)" stopOpacity=".25" />
          <stop offset="1" stopColor="var(--color-brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#pace-fill)" />
      <path d={d} fill="none" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round" />
      <line x1={P.l} x2={W - P.r} y1={y(min)} y2={y(min)} stroke="var(--color-price)" strokeDasharray="4 4" />
      <circle cx={x(0)} cy={y(max)} r="5" fill="var(--color-brand)" />
      <circle cx={x(last)} cy={y(min)} r="6" fill="var(--color-price)" />
      <text x={x(0) + 8} y={y(max) - 8} fontSize="12" fontWeight="700" fill="var(--color-ink)">{pace.currentKg} kg · hoy</text>
      <text x={x(last)} y={y(min) - 10} fontSize="12" fontWeight="700" fill="var(--color-price-dark)" textAnchor="end">
        {pace.targetKg} kg
      </text>
      <text x={P.l} y={H - 8} fontSize="11" fill="var(--color-muted)">Hoy</text>
      <text x={W - P.r} y={H - 8} fontSize="11" fill="var(--color-muted)" textAnchor="end">
        {pace.targetDateSlow ? formatDateEs(pace.targetDateSlow) : ""}
      </text>
    </svg>
  );
}
