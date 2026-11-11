"use client";
import { useEffect, useRef, useState } from "react";
import type { LoaderStep } from "@/funnel/types";

/** Progreso animado (~5 s) con mensajes; avanza solo al terminar. */
export function LoaderStepView({ step, onDone }: { step: LoaderStep; onDone: () => void }) {
  const [p, setP] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / step.durationMs);
      // easing suave: arranca rápido y frena al final
      setP(1 - Math.pow(1 - k, 2));
      if (k < 1) raf = requestAnimationFrame(tick);
      else if (!done.current) {
        done.current = true;
        setTimeout(onDone, 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step.durationMs, onDone]);

  const pct = Math.round(p * 100);
  const n = step.messages.length;
  const r = 70;
  const c = 2 * Math.PI * r;

  return (
    <section className="flex flex-col items-center pt-6 text-center">
      <div className="relative h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="80" cy="80" r={r} fill="none" stroke="var(--color-brand-soft)" strokeWidth="12" />
          <circle
            cx="80" cy="80" r={r} fill="none" stroke="var(--color-brand)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={c * (1 - p)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-extrabold tabular-nums">{pct}%</span>
      </div>
      <h1 className="mt-6 text-[26px] font-extrabold" role="status" aria-live="polite">{step.title}</h1>
      <ul className="mt-6 w-full max-w-xs space-y-3 text-left">
        {step.messages.map((m, i) => {
          const state = p >= (i + 1) / n ? "done" : p >= i / n ? "active" : "todo";
          return (
            <li key={m} className={`flex items-center gap-3 text-[17px] ${state === "todo" ? "text-muted/60" : "text-ink"}`}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                  state === "done" ? "bg-price text-white" : state === "active" ? "bg-brand-soft text-brand" : "bg-black/5"
                }`}
                aria-hidden="true"
              >
                {state === "done" ? "✓" : state === "active" ? "…" : ""}
              </span>
              {m}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
