"use client";
import Image from "next/image";
import { toggleMulti } from "@/funnel/engine";
import type { MultiStep } from "@/funnel/types";
import { Button } from "../ui/Button";
import { StepTitle } from "./StepTitle";

type Props = { step: MultiStep; value: string[]; onAnswer: (v: string[]) => void; onNext: () => void };

function Check({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${on ? "border-brand bg-brand text-white" : "border-brand/40 bg-white"}`}
    >
      {on ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : null}
    </span>
  );
}

/** Selección múltiple: "Continuar" queda deshabilitado hasta elegir al menos una. */
export function MultiStepView({ step, value, onAnswer, onNext }: Props) {
  const toggle = (id: string) => onAnswer(toggleMulti(step.options, value, id));

  return (
    <section className="pb-24">
      <StepTitle title={step.title} subtitle={step.subtitle} />

      {step.layout === "image" ? (
        <div className="grid grid-cols-2 gap-3">
          {step.options.map((o) => {
            const on = value.includes(o.id);
            return (
              <button
                key={o.id}
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(o.id)}
                className={`relative flex flex-col overflow-hidden rounded-2xl bg-white text-left ring-2 transition ${on ? "ring-brand" : "ring-black/5 hover:ring-brand/50"}`}
              >
                {o.image ? (
                  <Image src={o.image} alt="" width={300} height={300} sizes="(max-width: 448px) 45vw, 210px" className="aspect-square w-full object-cover" />
                ) : null}
                <span className="flex min-h-12 items-center gap-2 px-3 py-2 text-[15px] font-bold">
                  <Check on={on} />
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {step.options.map((o) => {
            const on = value.includes(o.id);
            return (
              <button
                key={o.id}
                role="checkbox"
                aria-checked={on}
                onClick={() => toggle(o.id)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[17px] font-bold transition ${
                  on ? "border-brand bg-brand-soft" : "border-brand/25 bg-white hover:border-brand/60"
                }`}
              >
                {o.emoji ? <span className="text-2xl" aria-hidden="true">{o.emoji}</span> : null}
                <span className="flex-1">{o.label}</span>
                <Check on={on} />
              </button>
            );
          })}
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-bg via-bg to-bg/0 px-4 pb-4 pt-6">
        <div className="mx-auto max-w-md">
          <Button onClick={onNext} disabled={value.length === 0}>
            {step.cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
