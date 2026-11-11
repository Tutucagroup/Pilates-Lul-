"use client";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { rulerInitial } from "@/funnel/engine";
import { useQuiz } from "@/funnel/store";
import type { Answers, RulerStep } from "@/funnel/types";
import { calcBmi, HEALTHY_BMI_MIN, weightForBmi } from "@/lib/rules/bmi";
import { formatFeetInches, fromDisplay, toDisplay, type HeightUnit, type WeightUnit } from "@/lib/units";
import { Button } from "../ui/Button";
import { StepTitle } from "./StepTitle";

type Props = {
  step: RulerStep;
  answers: Answers;
  hydrated: boolean;
  onAnswer: (metric: number) => void;
  onNext: () => void;
};

const TICK = 12; // px por unidad

/** Regla horizontal arrastrable (táctil, mouse y teclado). Guarda siempre en métrico. */
export function RulerStepView({ step, answers, hydrated, onAnswer, onNext }: Props) {
  const units = useQuiz((s) => s.units);
  const setUnit = useQuiz((s) => s.setUnit);
  const unit = step.measure === "height" ? units.height : units.weight;
  const unitOptions = step.measure === "height" ? (["cm", "in"] as const) : (["kg", "lb"] as const);

  const dMin = toDisplay(step.min, unit);
  const dMax = toDisplay(step.max, unit);
  const [metric, setMetric] = useState(() => rulerInitial(step, answers));
  const display = Math.min(dMax, Math.max(dMin, toDisplay(metric, unit)));

  // Al rehidratar, tomamos el valor guardado / derivado.
  useEffect(() => {
    if (hydrated) setMetric(rulerInitial(step, useQuiz.getState().answers));
  }, [hydrated, step]);

  const scroller = useRef<HTMLDivElement>(null);
  const settling = useRef(false);

  const scrollTo = useCallback(
    (v: number, smooth = false) => {
      const el = scroller.current;
      if (!el) return;
      settling.current = true;
      el.scrollTo({ left: (v - dMin) * TICK, behavior: smooth ? "smooth" : "auto" });
      setTimeout(() => (settling.current = false), smooth ? 250 : 0);
    },
    [dMin],
  );

  useLayoutEffect(() => {
    scrollTo(display);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, hydrated, dMin]);

  const endTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onScroll = () => {
    const el = scroller.current;
    if (!el || settling.current) return;
    const v = Math.min(dMax, Math.max(dMin, Math.round(el.scrollLeft / TICK) + dMin));
    if (v !== display) setMetric(fromDisplay(v, unit));
    clearTimeout(endTimer.current);
    endTimer.current = setTimeout(() => scrollTo(v, true), 140);
  };

  // Arrastre con mouse (en táctil se usa el scroll nativo).
  const drag = useRef<{ x: number; left: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !scroller.current) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft };
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !scroller.current) return;
    scroller.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const onPointerUp = () => (drag.current = null);

  const nudge = (delta: number) => {
    const v = Math.min(dMax, Math.max(dMin, display + delta));
    setMetric(fromDisplay(v, unit));
    scrollTo(v, true);
  };

  const big =
    unit === "in" ? (
      <>
        {formatFeetInches(display)} <span className="text-2xl text-muted">({display} in)</span>
      </>
    ) : (
      <>
        {display} <span className="text-3xl text-muted">{unit}</span>
      </>
    );

  // Aviso de peso objetivo por debajo del rango saludable.
  let warning: string | null = null;
  if (step.check?.type === "healthy-target") {
    const h = answers[step.check.heightStep];
    if (typeof h === "number" && calcBmi(h, metric) < HEALTHY_BMI_MIN) {
      const minKg = Math.ceil(weightForBmi(h, HEALTHY_BMI_MIN));
      const minLabel = unit === "lb" ? `${toDisplay(minKg, "lb")} lb` : `${minKg} kg`;
      warning = `Ese peso queda por debajo del rango saludable para tu altura. Te sugerimos un objetivo de al menos ${minLabel}.`;
    }
  }

  const range = dMax - dMin;
  const labelEvery = 10;
  const firstLabel = Math.ceil(dMin / labelEvery) * labelEvery;
  const labels: number[] = [];
  for (let v = firstLabel; v <= dMax; v += labelEvery) labels.push(v);

  return (
    <section>
      <StepTitle title={step.title} subtitle={step.subtitle} />

      <div className="mx-auto mb-6 flex w-fit rounded-2xl bg-white p-1 ring-1 ring-black/10">
        {unitOptions.map((u) => (
          <button
            key={u}
            onClick={() => setUnit(step.measure, u as HeightUnit & WeightUnit)}
            aria-pressed={unit === u}
            className={`min-h-12 min-w-20 rounded-xl px-4 text-[16px] font-bold ${unit === u ? "bg-brand text-white" : "text-muted"}`}
          >
            {u}
          </button>
        ))}
      </div>

      <p className="text-center text-6xl font-extrabold tabular-nums tracking-tight" aria-live="polite">
        {big}
      </p>
      <p className="mt-2 text-center text-[15px] text-muted">Deslizá para ajustar</p>

      <div className="relative mt-5 select-none">
        <div
          ref={scroller}
          onScroll={onScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onKeyDown={(e) => {
            const delta = e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : 0;
            if (delta) {
              e.preventDefault();
              nudge(delta);
            }
          }}
          role="slider"
          tabIndex={0}
          aria-label={step.title}
          aria-valuemin={dMin}
          aria-valuemax={dMax}
          aria-valuenow={display}
          aria-valuetext={`${display} ${unit}`}
          className="no-scrollbar flex cursor-grab overflow-x-auto rounded-2xl bg-white py-4 ring-1 ring-black/10 focus-visible:outline-2 focus-visible:outline-brand active:cursor-grabbing"
        >
          <div className="w-1/2 shrink-0" />
          <div
            className="relative h-16 shrink-0"
            style={{
              width: range * TICK + 1,
              backgroundImage: `repeating-linear-gradient(to right, #c9bfc2 0 1px, transparent 1px ${TICK}px),
                repeating-linear-gradient(to right, #8b7f83 0 2px, transparent 2px ${TICK * 5}px)`,
              backgroundSize: `100% 18px, 100% 28px`,
              backgroundRepeat: "no-repeat",
              // Las marcas largas caen en múltiplos de 5.
              backgroundPosition: `0 0, ${((5 - (dMin % 5)) % 5) * TICK}px 0`,
            }}
          >
            {labels.map((v) => (
              <span
                key={v}
                className="absolute top-9 -translate-x-1/2 text-[13px] font-semibold tabular-nums text-muted"
                style={{ left: (v - dMin) * TICK }}
              >
                {v}
              </span>
            ))}
          </div>
          <div className="w-1/2 shrink-0" />
        </div>
        <div className="pointer-events-none absolute top-2 left-1/2 h-11 w-1 -translate-x-1/2 rounded-full bg-brand" />
      </div>

      {warning ? (
        <p role="note" className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-[15px] text-amber-900 ring-1 ring-amber-200">
          {warning}
        </p>
      ) : null}
      {step.note ? <p className="mt-5 text-center text-[15px] text-muted">🔒 {step.note}</p> : null}

      <div className="mt-8">
        <Button
          onClick={() => {
            onAnswer(metric);
            onNext();
          }}
        >
          {step.cta}
        </Button>
      </div>
    </section>
  );
}
