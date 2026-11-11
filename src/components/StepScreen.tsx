"use client";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { funnel } from "@/config/funnel.config";
import {
  applyVariant,
  assignVariant,
  firstUnanswered,
  isQuestionStep,
  nextStepId,
  prevStepId,
  progressFor,
  visibleSteps,
} from "@/funnel/engine";
import { useQuiz } from "@/funnel/store";
import type { AnswerValue, Step } from "@/funnel/types";
import { buildPlanSummary } from "@/lib/rules/summary";
import { logQuizEvent, trackMeta } from "@/lib/tracking/client";
import { Header } from "./Header";
import { SingleStepView } from "./steps/SingleStep";
import { MultiStepView } from "./steps/MultiStep";
import { InfoStepView } from "./steps/InfoStep";
import { RulerStepView } from "./steps/RulerStep";
import { LoaderStepView } from "./steps/LoaderStep";
import { ResultStepView } from "./steps/ResultStep";
import { OfferStepView } from "./offer/OfferStep";

const FIRST_ID = funnel.steps[0].id;
export const hrefFor = (id: string) => (id === FIRST_ID ? "/" : `/q/${id}`);

export function StepScreen({ stepId }: { stepId: string }) {
  const router = useRouter();
  const base = funnel.steps.find((s) => s.id === stepId) as Step;

  const hydrated = useQuiz((s) => s.hydrated);
  const answers = useQuiz((s) => s.answers);
  const sessionId = useQuiz((s) => s.sessionId);
  const variants = useQuiz((s) => s.variants);
  const setAnswer = useQuiz((s) => s.setAnswer);

  // Variante A/B (se fija la primera vez que la sesión ve el paso).
  const variant = variants[base.id] ?? (hydrated && sessionId ? assignVariant(base, sessionId) : "A");
  const step = useMemo(() => applyVariant(base, variant), [base, variant]);
  const hasAB = !!base.variants && Object.keys(base.variants).length > 0;

  const vis = visibleSteps(funnel.steps, answers);
  const index = Math.max(0, vis.findIndex((s) => s.id === base.id));
  const prev = prevStepId(funnel.steps, base.id, answers);
  const progress = isQuestionStep(base) ? progressFor(funnel.steps, base.id, answers) : null;

  // Protege loader/resultado: si faltan respuestas, mandamos al primer paso pendiente.
  useEffect(() => {
    if (!hydrated) return;
    if (base.type === "loader" || base.type === "result") {
      const pending = firstUnanswered(funnel.steps, useQuiz.getState().answers);
      if (pending) router.replace(hrefFor(pending.id));
    }
  }, [hydrated, base.type, router]);

  // Vista del paso: tracking + guardar "último paso" para retomar.
  const viewed = useRef(false);
  useEffect(() => {
    if (!hydrated || !sessionId || viewed.current) return;
    viewed.current = true;
    const s = useQuiz.getState();
    if (!s.variants[base.id]) s.setVariant(base.id, variant);
    // El primer paso no pisa el "último paso" para que el banner de retomar siga disponible.
    if (base.id !== FIRST_ID) s.setLastStep(base.id);
    trackMeta("quiz_step", { step_number: index + 1, step_name: base.name, step_id: base.id, variant });
    logQuizEvent({ event: "view", stepId: base.id, stepIndex: index, stepName: base.name, variant });
  }, [hydrated, sessionId, base, index, variant]);

  // Prefetch del siguiente paso para que la transición sea instantánea.
  useEffect(() => {
    const next = nextStepId(funnel.steps, base.id, answers);
    if (next) router.prefetch(hrefFor(next));
  }, [base.id, answers, router]);

  const answer = useCallback(
    (value: AnswerValue) => {
      setAnswer(base.id, value);
      logQuizEvent({ event: "answer", stepId: base.id, stepIndex: index, stepName: base.name, variant, value });
    },
    [base, index, variant, setAnswer],
  );

  const goNext = useCallback(() => {
    const next = nextStepId(funnel.steps, base.id, useQuiz.getState().answers);
    if (next) router.push(hrefFor(next));
  }, [base.id, router]);

  const summary = useMemo(
    () => (base.type === "result" || base.type === "offer" ? buildPlanSummary(funnel, answers) : null),
    [base.type, answers],
  );

  const value = answers[base.id];
  let body: React.ReactNode;
  switch (step.type) {
    case "single":
      body = <SingleStepView step={step} value={typeof value === "string" ? value : undefined} answers={answers} onAnswer={answer} onNext={goNext} priority={index === 0} />;
      break;
    case "multi":
      body = <MultiStepView step={step} value={Array.isArray(value) ? value : []} onAnswer={answer} onNext={goNext} />;
      break;
    case "info":
      body = <InfoStepView step={step} onNext={goNext} />;
      break;
    case "ruler":
      body = <RulerStepView step={step} answers={answers} hydrated={hydrated} onAnswer={answer} onNext={goNext} />;
      break;
    case "loader":
      body = <LoaderStepView step={step} onDone={goNext} />;
      break;
    case "result":
      body = summary && (
        <ResultStepView
          step={step}
          summary={summary}
          hydrated={hydrated}
          onNext={goNext}
          onShown={() => {
            const s = useQuiz.getState();
            logQuizEvent({ event: "result", stepId: base.id, stepIndex: index, stepName: base.name, variant });
            if (!s.sent.lead) {
              trackMeta("Lead", { content_name: base.name, level: summary.level });
              s.markSent("lead");
            }
          }}
        />
      );
      break;
    case "offer":
      body = summary && <OfferStepView summary={summary} hydrated={hydrated} stepIndex={index} stepName={base.name} />;
      break;
  }

  const isOffer = base.type === "offer";
  return (
    <>
      <Header backHref={isOffer || base.type === "loader" ? null : prev ? hrefFor(prev) : null} progress={progress} />
      <main
        className={`mx-auto max-w-md px-4 ${progress != null ? "pt-[76px]" : "pt-[64px]"} pb-10 ${
          hasAB && !hydrated ? "opacity-0" : ""
        }`}
      >
        {body}
      </main>
    </>
  );
}
