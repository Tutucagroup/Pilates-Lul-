"use client";
import Image from "next/image";
import type { InfoStep } from "@/funnel/types";
import { Button } from "../ui/Button";

/** Pantalla de refuerzo: título, texto, imagen y botón. */
export function InfoStepView({ step, onNext }: { step: InfoStep; onNext: () => void }) {
  return (
    <section className="flex flex-col items-center text-center animate-fade-up">
      {step.image ? (
        <div className="mb-6 w-full overflow-hidden rounded-3xl">
          <Image
            src={step.image.src}
            alt={step.image.alt}
            width={step.image.width}
            height={step.image.height}
            priority
            sizes="(max-width: 448px) 100vw, 448px"
            className="h-auto w-full"
          />
        </div>
      ) : null}
      <h1 className="text-[26px] font-extrabold leading-tight tracking-tight">{step.title}</h1>
      <p className="mt-3 text-[18px] text-muted">{step.text}</p>
      <div className="mt-8 w-full">
        <Button onClick={onNext}>{step.cta}</Button>
      </div>
    </section>
  );
}
