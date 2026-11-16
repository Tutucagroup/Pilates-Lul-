"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, Clock, Lock, Play } from "lucide-react";
import { Chip, LinkButton, PageTitle, Ring } from "@/components/ui";
import { TOTAL_DAYS, program, weekOf, weeks } from "@/data/program";
import { currentDay, doneCount, isUnlocked, useApp } from "@/lib/store";

export default function Programa() {
  const completions = useApp((s) => s.completions);
  const done = doneCount(completions);
  const day = currentDay(completions);
  const finished = done >= TOTAL_DAYS;
  const [week, setWeek] = useState(weekOf(day));
  const info = weeks[week - 1];

  return (
    <div className="animate-fade-up pt-2">
      <PageTitle title="Tu programa" subtitle="28 días, una clase por día" />

      <section className="flex items-center gap-4 rounded-3xl bg-brand-soft p-5">
        <Ring value={done} total={TOTAL_DAYS} size={88} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-[20px] font-semibold leading-tight">
            {finished ? "Reto completo" : done === 0 ? "Tu momento es hoy" : `Vas por el día ${day}`}
          </p>
          {!finished && <LinkButton href={`/programa/${day}`} className="mt-3 !min-h-11 !py-2 !text-[16px]"><Play size={17} fill="currentColor" /> {done === 0 ? "Empezar" : "Continuar"}</LinkButton>}
        </div>
      </section>

      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Elegí una semana">
        {weeks.map((w) => <Chip key={w.n} active={week === w.n} onClick={() => setWeek(w.n)}>Semana {w.n}</Chip>)}
      </div>

      <h2 className="mt-5 font-display text-[22px] font-semibold">Semana {info.n} · {info.name}</h2>
      <p className="text-muted">{info.text}</p>

      <ol className="mt-4 space-y-2.5">
        {program.filter((c) => weekOf(c.day) === week).map((c) => {
          const isDone = !!completions[c.day];
          const unlocked = isUnlocked(c.day, completions);
          const isToday = !finished && c.day === day;
          const body = (
            <>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-full font-display text-[18px] font-semibold ${
                isDone ? "bg-sage text-white [[data-theme=dark]_&]:text-bg" : isToday ? "bg-brand text-white [[data-theme=dark]_&]:text-bg" : "bg-bg text-muted"
              }`}>
                {isDone ? <Check size={21} strokeWidth={3} /> : unlocked ? c.day : <Lock size={17} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-extrabold uppercase tracking-wider text-muted">
                  {isToday ? `Hoy · Día ${c.day}` : `Día ${c.day}`}{isDone ? " · Hecha" : ""}
                </span>
                <span className="block font-bold leading-snug">{c.title}</span>
                <span className="mt-0.5 flex items-center gap-2 text-[14px] text-muted">{c.category} · <Clock size={14} /> {c.minutes} min</span>
              </span>
            </>
          );
          return (
            <li key={c.day}>
              {unlocked ? (
                <Link href={`/programa/${c.day}`} className={`flex items-center gap-3 rounded-2xl bg-surface p-3.5 ring-1 ${isToday ? "ring-2 ring-brand" : "ring-line"}`}>{body}</Link>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 opacity-60 ring-1 ring-line" aria-disabled="true">{body}</div>
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-4 text-center text-[14px] text-muted">Cada día se habilita al completar el anterior.</p>
    </div>
  );
}
