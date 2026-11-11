"use client";
import { useEffect, useRef } from "react";
import { brand } from "@/config/brand.config";
import type { ResultStep } from "@/funnel/types";
import type { PlanSummary } from "@/lib/rules/summary";
import { MAX_KG_PER_WEEK, MIN_KG_PER_WEEK } from "@/lib/rules/pace";
import { decimalEs, formatDateEs, joinEs } from "@/lib/format";
import { BmiScale } from "../BmiScale";
import { PaceChart } from "../PaceChart";
import { Button } from "../ui/Button";

type Props = { step: ResultStep; summary: PlanSummary; hydrated: boolean; onNext: () => void; onShown: () => void };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <span className="text-[15px] text-muted">{label}</span>
      <span className="text-right text-[16px] font-bold">{value}</span>
    </div>
  );
}

/** Resumen personalizado: objetivo, zonas, nivel, IMC y ritmo estimado. */
export function ResultStepView({ step, summary: s, hydrated, onNext, onShown }: Props) {
  const shown = useRef(false);
  useEffect(() => {
    if (hydrated && !shown.current) {
      shown.current = true;
      onShown();
    }
  }, [hydrated, onShown]);

  const zones = s.zoneLabels.length ? joinEs(s.zoneLabels.map((z) => z.toLowerCase())) : null;
  const { program } = brand;
  const pace = s.pace;

  return (
    <section className="animate-fade-up">
      <h1 className="text-center text-[28px] font-extrabold leading-tight">{step.title}</h1>
      <p className="mt-2 text-center text-[17px] text-muted">
        Armamos un {program.name.toLowerCase()} de nivel <b className="text-ink">{s.levelLabel.toLowerCase()}</b>
        {s.goalLabel ? <> para <b className="text-ink">{s.goalLabel.toLowerCase()}</b></> : null}
        {zones ? <>, con foco en <b className="text-ink">{zones}</b></> : null}.
      </p>

      <div className="mt-6 divide-y divide-black/5 rounded-3xl bg-white px-5 ring-1 ring-black/5">
        {s.goalLabel ? <Row label="Tu objetivo" value={s.goalLabel} /> : null}
        {s.zoneLabels.length ? <Row label="Zonas" value={s.zoneLabels.join(" · ")} /> : null}
        <Row label="Nivel" value={s.levelLabel} />
        <Row label="Tiempo por día" value={`${program.minutesPerDay} minutos`} />
        <Row label="Duración" value={`${program.days} días`} />
        {s.improveLabels.length ? <Row label="También vas a trabajar" value={s.improveLabels.join(" · ")} /> : null}
      </div>

      {s.bmi ? (
        <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <BmiScale bmi={s.bmi} range={s.bmiRange} />
        </div>
      ) : null}

      {pace ? (
        <div className="mt-4 rounded-3xl bg-white p-5 ring-1 ring-black/5">
          <h2 className="text-[18px] font-extrabold">Tu ritmo estimado</h2>
          {pace.status === "ok" ? (
            <>
              <p className="mt-1 text-[15px] text-muted">
                A un ritmo prudente de {decimalEs(MIN_KG_PER_WEEK)} a {MAX_KG_PER_WEEK} kg por semana, podrías acercarte a{" "}
                <b className="text-ink">{decimalEs(pace.targetKg)} kg</b> entre el{" "}
                <b className="text-ink">{formatDateEs(pace.targetDateFast!)}</b> y el{" "}
                <b className="text-ink">{formatDateEs(pace.targetDateSlow!)}</b>, si sostenés el hábito después del reto.
              </p>
              <div className="mt-3">
                <PaceChart pace={pace} />
              </div>
              <p className="mt-2 text-[13px] text-muted">
                Es una estimación orientativa, no una promesa: también influyen la alimentación, el descanso y la constancia.
              </p>
            </>
          ) : pace.status === "unhealthy-target" ? (
            <p className="mt-1 text-[15px] text-muted">
              El peso que elegiste queda por debajo del rango saludable para tu altura (menos de {Math.ceil(pace.minHealthyKg)} kg), así que no
              te vamos a marcar una fecha. Te proponemos enfocarte en moverte mejor y ganar firmeza.
            </p>
          ) : (
            <p className="mt-1 text-[15px] text-muted">
              Tu objetivo es mantener tu peso: el plan se enfoca en tonificar, ganar movilidad y sentirte mejor.
            </p>
          )}
        </div>
      ) : null}

      {s.hasDiscomfort ? (
        <p role="note" className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-[15px] text-amber-900 ring-1 ring-amber-200">
          Como mencionaste molestias, tu plan prioriza movimientos suaves. Si tenés una lesión o condición médica, consultá con tu médico antes de empezar.
        </p>
      ) : null}

      <div className="mt-6">
        <Button onClick={onNext}>{step.cta}</Button>
      </div>
    </section>
  );
}
