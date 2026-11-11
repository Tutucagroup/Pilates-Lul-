"use client";
import Image from "next/image";
import { useState } from "react";
import { evalCondition } from "@/funnel/engine";
import type { Answers, SingleStep } from "@/funnel/types";
import { Button } from "../ui/Button";
import { StepTitle } from "./StepTitle";

type Props = {
  step: SingleStep;
  value?: string;
  answers: Answers;
  onAnswer: (id: string) => void;
  onNext: () => void;
  priority?: boolean;
};

const ADVANCE_DELAY_MS = 220;

/** Opción única: avanza sola al tocar (salvo que la respuesta dispare un aviso). */
export function SingleStepView({ step, value, answers, onAnswer, onNext, priority }: Props) {
  const [picked, setPicked] = useState<string | undefined>(undefined);
  const selected = picked ?? value;

  const activeNotes = (step.notes ?? []).filter((n) =>
    evalCondition(n.when, { ...answers, [step.id]: selected }),
  );

  const choose = (id: string) => {
    setPicked(id);
    onAnswer(id);
    const notes = (step.notes ?? []).filter((n) => evalCondition(n.when, { ...answers, [step.id]: id }));
    if (notes.length === 0) setTimeout(onNext, ADVANCE_DELAY_MS);
  };

  return (
    <section>
      <StepTitle label={step.label} title={step.title} subtitle={step.subtitle} />

      {step.layout === "image" ? (
        <div className="grid grid-cols-3 gap-3">
          {step.options.map((o) => {
            const on = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                aria-pressed={on}
                className={`flex flex-col overflow-hidden rounded-2xl bg-white text-left ring-2 transition ${
                  on ? "ring-brand" : "ring-black/5 hover:ring-brand/50"
                }`}
              >
                {o.image ? (
                  <Image src={o.image} alt="" width={240} height={320} sizes="(max-width: 448px) 30vw, 140px" className="aspect-[3/4] w-full object-cover" />
                ) : null}
                <span className="flex min-h-12 flex-1 items-center px-2 py-2 text-[14px] font-bold leading-tight">{o.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {step.options.map((o) => {
            const on = selected === o.id;
            return (
              <button
                key={o.id}
                onClick={() => choose(o.id)}
                aria-pressed={on}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-[17px] font-bold transition ${
                  on ? "border-brand bg-brand-soft" : "border-brand/25 bg-white hover:border-brand/60"
                }`}
              >
                {o.emoji ? <span className="text-2xl" aria-hidden="true">{o.emoji}</span> : null}
                <span className="flex-1">{o.label}</span>
                <span aria-hidden="true" className="text-brand">→</span>
              </button>
            );
          })}
        </div>
      )}

      {activeNotes.length > 0 ? (
        <div className="mt-5 space-y-4 animate-fade-up">
          {activeNotes.map((n) => (
            <p key={n.text} role="note" className="rounded-2xl bg-amber-50 px-4 py-3 text-[15px] text-amber-900 ring-1 ring-amber-200">
              {n.text}
            </p>
          ))}
          <Button onClick={onNext}>Continuar</Button>
        </div>
      ) : null}

      {step.image ? (
        <div className="mt-6 overflow-hidden rounded-3xl">
          <Image
            src={step.image.src}
            alt={step.image.alt}
            width={step.image.width}
            height={step.image.height}
            priority={priority}
            fetchPriority={priority ? "high" : undefined}
            sizes="(max-width: 448px) 100vw, 448px"
            className="h-auto w-full"
          />
        </div>
      ) : null}
    </section>
  );
}
