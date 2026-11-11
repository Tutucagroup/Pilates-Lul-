"use client";
import Link from "next/link";
import { funnel } from "@/config/funnel.config";
import { useQuiz } from "@/funnel/store";

/** Si hay un cuestionario a medias guardado, ofrece retomarlo (sin redirigir a la fuerza). */
export function ResumeBanner() {
  const hydrated = useQuiz((s) => s.hydrated);
  const lastStepId = useQuiz((s) => s.lastStepId);
  const reset = useQuiz((s) => s.reset);
  if (!hydrated || !lastStepId || lastStepId === funnel.steps[0].id) return null;
  if (!funnel.steps.some((s) => s.id === lastStepId)) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3">
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 animate-fade-up">
        <p className="flex-1 text-[15px] leading-snug">Tenés un cuestionario a medias.</p>
        <button onClick={reset} className="min-h-12 rounded-xl px-3 text-[15px] font-semibold text-muted">
          Empezar de nuevo
        </button>
        <Link href={`/q/${lastStepId}`} className="flex min-h-12 items-center rounded-xl bg-brand px-4 font-bold text-white">
          Retomar
        </Link>
      </div>
    </div>
  );
}
