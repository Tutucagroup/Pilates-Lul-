"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { useApp, type Goal, type Level } from "@/lib/store";
import type { Diet } from "@/lib/mealplan";
import { Logo } from "./Logo";
import { Button } from "./ui";

const goals: { id: Goal; label: string }[] = [
  { id: "tonificar", label: "Tonificar y sentirme más firme" },
  { id: "movilidad", label: "Moverme con más soltura" },
  { id: "espalda", label: "Cuidar mi espalda y mi postura" },
  { id: "energia", label: "Tener más energía y bajar el estrés" },
];
const levels: { id: Level; label: string }[] = [
  { id: "nunca", label: "Nunca hice pilates" },
  { id: "algo", label: "Hice algo, hace tiempo" },
  { id: "habitual", label: "Hago ejercicio seguido" },
];
const diets: { id: Diet; label: string }[] = [
  { id: "todo", label: "Como de todo" },
  { id: "vegetariana", label: "Vegetariana" },
  { id: "vegana", label: "Vegana" },
  { id: "sin gluten", label: "Sin gluten" },
];
const careOptions = ["Espalda o cintura", "Rodillas", "Cuello y hombros", "Suelo pélvico", "Presión o mareos"];

function Option({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left text-[17px] font-bold ring-1 transition-colors ${
        selected ? "bg-brand-soft text-brand-dark ring-brand" : "bg-surface text-ink ring-line"
      }`}
    >
      {children}
      {selected && <Check size={20} className="shrink-0" />}
    </button>
  );
}

export function Onboarding() {
  const setProfile = useApp((s) => s.setProfile);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [cares, setCares] = useState<string[]>([]);
  const [diet, setDiet] = useState<Diet>("todo");

  const canNext = [name.trim().length > 0, goal !== null, level !== null, true][step];
  const next = () => {
    if (step < 3) return setStep(step + 1);
    setProfile({ name: name.trim(), goal: goal!, level: level!, diet, cares });
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col px-5 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <Logo />
        <span className="text-[14px] font-bold text-muted" aria-live="polite">Paso {step + 1} de 4</span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-brand-soft" aria-hidden="true">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>

      <div key={step} className="animate-fade-up mt-8 flex-1">
        {step === 0 && (
          <>
            <h1 className="font-display text-[30px] font-semibold leading-tight">Te damos la bienvenida</h1>
            <p className="mt-2 text-muted">Cuatro preguntas cortas para preparar tu plan.</p>
            <label htmlFor="name" className="mt-8 block font-bold">¿Cómo te llamás?</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canNext && next()}
              autoComplete="given-name"
              maxLength={30}
              placeholder="Tu nombre"
              className="mt-2 min-h-14 w-full rounded-2xl bg-surface px-4 text-[18px] ring-1 ring-line placeholder:text-muted/70"
            />
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="font-display text-[28px] font-semibold leading-tight">¿Qué querés lograr, {name.trim()}?</h1>
            <p className="mt-2 text-muted">Elegí lo que más te importa hoy.</p>
            <div className="mt-6 space-y-3">
              {goals.map((g) => <Option key={g.id} selected={goal === g.id} onClick={() => setGoal(g.id)}>{g.label}</Option>)}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="font-display text-[28px] font-semibold leading-tight">¿Cuánta experiencia tenés?</h1>
            <p className="mt-2 text-muted">No hay respuesta incorrecta. El reto arranca desde cero.</p>
            <div className="mt-6 space-y-3">
              {levels.map((l) => <Option key={l.id} selected={level === l.id} onClick={() => setLevel(l.id)}>{l.label}</Option>)}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="font-display text-[28px] font-semibold leading-tight">Últimos detalles</h1>
            <p className="mt-6 font-bold">¿Hay alguna zona que quieras cuidar? <span className="font-normal text-muted">(opcional)</span></p>
            <div className="mt-3 space-y-2.5">
              {careOptions.map((c) => (
                <Option key={c} selected={cares.includes(c)} onClick={() => setCares(cares.includes(c) ? cares.filter((x) => x !== c) : [...cares, c])}>{c}</Option>
              ))}
            </div>
            <p className="mt-7 font-bold">¿Cómo comés?</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {diets.map((d) => <Option key={d.id} selected={diet === d.id} onClick={() => setDiet(d.id)}>{d.label}</Option>)}
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 0 && <Button variant="ghost" className="!w-auto" onClick={() => setStep(step - 1)}>Atrás</Button>}
        <Button onClick={next} disabled={!canNext}>{step === 3 ? "Empezar" : "Continuar"}</Button>
      </div>
      {step === 3 && (
        <p className="mt-4 text-center text-[14px] text-muted">
          Si tenés una condición médica o estás embarazada, consultá con tu médica o médico antes de empezar.
        </p>
      )}
    </div>
  );
}
