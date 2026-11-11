import { BMI_RANGES, type BmiRange } from "@/lib/rules/bmi";
import { decimalEs } from "@/lib/format";

const COLORS = ["#93c5fd", "#86efac", "#fcd34d", "#fca5a5"];
const LO = 15, HI = 40;

/** Escala de IMC con los rangos de referencia y un marcador. Sin diagnósticos. */
export function BmiScale({ bmi, range }: { bmi: number; range: BmiRange | null }) {
  const pos = ((Math.min(HI, Math.max(LO, bmi)) - LO) / (HI - LO)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-semibold text-muted">Tu IMC</span>
        <span className="text-3xl font-extrabold tabular-nums">{decimalEs(bmi)}</span>
      </div>
      <div className="relative mt-3">
        <div className="flex h-3 overflow-hidden rounded-full">
          {BMI_RANGES.map((r, i) => {
            const a = Math.max(LO, r.min), b = Math.min(HI, r.max);
            return <div key={r.id} style={{ width: `${((b - a) / (HI - LO)) * 100}%`, background: COLORS[i] }} />;
          })}
        </div>
        <div className="absolute -top-1.5 h-6 w-1.5 -translate-x-1/2 rounded-full bg-ink ring-2 ring-white" style={{ left: `${pos}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[12px] text-muted tabular-nums">
        <span>{LO}</span><span>18,5</span><span>25</span><span>30</span><span>{HI}</span>
      </div>
      {range ? <p className="mt-2 text-[16px] font-bold">{range.label}</p> : null}
      <p className="mt-1 text-[13px] text-muted">
        El IMC es una referencia general: no mide tu composición corporal ni reemplaza una consulta médica.
      </p>
    </div>
  );
}
