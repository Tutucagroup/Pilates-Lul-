"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpenText, ChevronRight, Clock, Flame, Lightbulb, PartyPopper, Play, X } from "lucide-react";
import { MealPlan } from "@/components/MealPlan";
import { Card, Eyebrow, LinkButton, Ring } from "@/components/ui";
import { getClass, weekOf } from "@/data/program";
import { tips } from "@/data/tips";
import { dateKey } from "@/lib/dates";
import { computeStreak } from "@/lib/streak";
import { allDoneDates, currentDay, doneCount, useActivePlan, useApp } from "@/lib/store";

export default function Home() {
  const profile = useApp((s) => s.profile)!;
  const completions = useApp((s) => s.completions);
  const [tipOpen, setTipOpen] = useState(false);

  const { plan, done: doneMap } = useActivePlan();
  const total = plan.classes.length;
  const done = doneCount(doneMap);
  const finished = done >= total;
  const day = currentDay(plan, doneMap);
  const cls = getClass(plan, day)!;
  const tip = tips[(day - 1) % tips.length];
  const today = dateKey();
  const dates = allDoneDates(completions);
  const doneToday = dates.includes(today);
  const { streak } = computeStreak(dates, today);
  const weekN = weekOf(plan, day);
  const week = plan.weeks[weekN - 1];

  return (
    <div className="animate-fade-up space-y-4 pt-2">
      <header>
        <h1 className="font-display text-[30px] font-semibold leading-tight">Hola, {profile.name}</h1>
        <p className="mt-1 text-muted">
          {finished
            ? "Completaste este plan. Podés repetir la clase que quieras."
            : done === 0
              ? "Tu plan empieza hoy."
              : doneToday
                ? "Clase de hoy cumplida. Mañana seguimos."
                : `Semana ${weekN} · ${week.name}`}
        </p>
      </header>

      {finished ? (
        <Card className="bg-brand-soft text-center ring-0">
          <PartyPopper className="mx-auto text-brand" size={36} />
          <h2 className="mt-2 font-display text-[24px] font-semibold">Plan completo</h2>
          <p className="mt-1 text-muted">Lo hiciste. Tu cuerpo ya conoce el camino.</p>
          <LinkButton href="/programa" className="mt-4">Ver clases y elegir otro plan</LinkButton>
        </Card>
      ) : (
        <Card className="overflow-hidden !p-0">
          <div className="bg-brand-soft px-5 pb-5 pt-4">
            <Eyebrow>{doneToday ? `Próxima clase · Día ${day}` : `Tu clase de hoy · Día ${day}`}</Eyebrow>
            <p className="mt-0.5 text-[14px] font-bold text-muted">{plan.name}</p>
            <h2 className="mt-1.5 font-display text-[25px] font-semibold leading-tight">{cls.title}</h2>
            <p className="mt-2 flex items-center gap-3 text-[15px] font-bold text-muted">
              <span>{cls.category}</span>
              <span className="flex items-center gap-1"><Clock size={16} /> {cls.minutes} min</span>
            </p>
          </div>
          <div className="p-5">
            <p className="text-muted">{cls.description}</p>
            <LinkButton href={`/programa/${day}`} className="mt-4">
              <Play size={19} fill="currentColor" /> {doneToday ? "Ver la clase" : "Comenzar la clase"}
            </LinkButton>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Card className="flex items-center justify-center">
          <Ring value={done} total={total} />
        </Card>
        <Card className="flex flex-col justify-center gap-3">
          <p className="flex items-center gap-2.5">
            <Flame className="text-brand" size={22} />
            <span><b className="font-display text-[22px] font-semibold">{streak}</b> <span className="text-muted">{streak === 1 ? "día de racha" : "días de racha"}</span></span>
          </p>
          <Link href="/progreso" className="flex min-h-11 items-center gap-1 font-bold text-brand-dark">
            Ver mi progreso <ChevronRight size={18} />
          </Link>
        </Card>
      </div>

      <button
        type="button"
        onClick={() => setTipOpen(true)}
        className="flex w-full items-center gap-3 rounded-3xl bg-sage-soft p-4 text-left"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-sage"><Lightbulb size={22} /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] font-extrabold uppercase tracking-wider text-sage">Tip del día · 1 minuto</span>
          <span className="block font-bold">{tip.title}</span>
        </span>
        <ChevronRight className="shrink-0 text-sage" size={20} />
      </button>

      <Card>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-[22px] font-semibold">Qué comer hoy</h2>
            <p className="text-[15px] text-muted">Ideas simples. Cambiá la que no te guste.</p>
          </div>
        </div>
        <MealPlan day={day} />
        <Link href="/recetas" className="mt-3 flex min-h-11 items-center justify-center gap-1 font-bold text-brand-dark">
          Ver todas las recetas <ChevronRight size={18} />
        </Link>
      </Card>

      <Link href="/guia" className="flex items-center gap-3 rounded-3xl bg-surface p-4 ring-1 ring-line">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><BookOpenText size={22} /></span>
        <span className="flex-1">
          <span className="block font-bold">Guía de bienvenida</span>
          <span className="block text-[15px] text-muted">Cómo aprovechar tu plan</span>
        </span>
        <ChevronRight className="text-muted" size={20} />
      </Link>

      {tipOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog" aria-modal="true" aria-labelledby="tip-title" onClick={() => setTipOpen(false)}>
          <div className="animate-fade-up w-full max-w-[480px] rounded-3xl bg-surface p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Eyebrow className="!text-sage">Tip del día {day}</Eyebrow>
                <h2 id="tip-title" className="mt-1 font-display text-[24px] font-semibold leading-tight">{tip.title}</h2>
              </div>
              <button type="button" onClick={() => setTipOpen(false)} aria-label="Cerrar" autoFocus className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-brand-soft"><X size={22} /></button>
            </div>
            <p className="mt-3 text-[18px] leading-relaxed">{tip.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}
