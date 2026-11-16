"use client";
import { useState } from "react";
import { Award, ChevronLeft, ChevronRight, Clock, Flame, Trash2 } from "lucide-react";
import { Button, Card, PageTitle, Ring } from "@/components/ui";
import { getClass, getPlan } from "@/data/program";
import { addDays, dateKey, parseKey } from "@/lib/dates";
import { computeStreak } from "@/lib/streak";
import { allDoneDates, doneCount, useActivePlan, useApp, type Energy } from "@/lib/store";

const energies: { id: Energy; label: string; h: string }[] = [
  { id: "alta", label: "Con energía", h: "100%" },
  { id: "normal", label: "Normal", h: "62%" },
  { id: "baja", label: "Cansada", h: "28%" },
];
const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const fmt = (key: string) => parseKey(key).toLocaleDateString("es-AR", { day: "numeric", month: "short" });

export default function Progreso() {
  const completions = useApp((s) => s.completions);
  const energy = useApp((s) => s.energy);
  const setEnergy = useApp((s) => s.setEnergy);
  const weights = useApp((s) => s.weights);
  const addWeight = useApp((s) => s.addWeight);
  const removeWeight = useApp((s) => s.removeWeight);

  const today = dateKey();
  const { plan, done: planDone } = useActivePlan();
  const total = plan.classes.length;
  const done = doneCount(planDone);
  const doneDates = new Set(allDoneDates(completions));
  const { streak, freeDays } = computeStreak(doneDates, today);
  const free = new Set(freeDays);
  const minutes = Object.entries(completions).reduce(
    (sum, [id, days]) => sum + Object.keys(days).reduce((m, d) => m + (getClass(getPlan(id), Number(d))?.minutes ?? 0), 0),
    0,
  );
  const milestones = [...new Set([7, 14, total])].filter((n) => n <= total).sort((a, b) => a - b);

  // Calendario mensual
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const first = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // semana que empieza en lunes
  const cells: (string | null)[] = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => dateKey(new Date(first.getFullYear(), first.getMonth(), i + 1))),
  ];

  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13));
  const hasEnergy = last14.some((k) => energy[k]);

  const [kg, setKg] = useState("");
  const kgNum = Number(kg.replace(",", "."));
  const kgValid = kgNum >= 30 && kgNum <= 250;
  const wFirst = weights[0];
  const wLast = weights[weights.length - 1];
  const diff = wFirst && wLast && weights.length > 1 ? wLast.kg - wFirst.kg : null;

  return (
    <div className="animate-fade-up space-y-4 pt-2">
      <PageTitle title="Tu progreso" subtitle={plan.name} />

      <div className="grid grid-cols-[auto_1fr] gap-4">
        <Card className="flex items-center justify-center"><Ring value={done} total={total} /></Card>
        <Card className="flex flex-col justify-center gap-2.5">
          <p className="flex items-center gap-2.5"><Flame className="shrink-0 text-brand" size={22} /><span><b className="font-display text-[22px] font-semibold">{streak}</b> <span className="text-muted">{streak === 1 ? "día de racha" : "días de racha"}</span></span></p>
          <p className="flex items-center gap-2.5"><Clock className="shrink-0 text-sage" size={22} /><span><b className="font-display text-[22px] font-semibold">{minutes}</b> <span className="text-muted">min en total</span></span></p>
        </Card>
      </div>
      <p className="px-1 text-[15px] text-muted">Tenés 1 día libre por semana: si un día no podés, la racha no se corta.</p>

      <Card>
        <h2 className="font-display text-[22px] font-semibold">¿Cómo te sentís hoy?</h2>
        <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Tu energía de hoy">
          {energies.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={energy[today] === e.id}
              onClick={() => setEnergy(e.id)}
              className={`min-h-14 rounded-2xl px-2 text-[15px] font-bold leading-tight ring-1 ${energy[today] === e.id ? "bg-brand-soft text-brand-dark ring-brand" : "bg-bg ring-line"}`}
            >
              {e.label}
            </button>
          ))}
        </div>
        <p className="mt-5 text-[12.5px] font-extrabold uppercase tracking-wider text-muted">Tu energía · últimos 14 días</p>
        {hasEnergy ? (
          <>
            <div className="mt-3 flex h-24 items-end gap-1.5" role="img" aria-label="Gráfico de tu energía en los últimos 14 días">
              {last14.map((k) => {
                const e = energies.find((x) => x.id === energy[k]);
                return (
                  <div key={k} className="flex h-full flex-1 items-end rounded-md bg-bg" title={`${fmt(k)}: ${e?.label ?? "sin registro"}`}>
                    {e && <div className={`w-full rounded-md ${e.id === "baja" ? "bg-brand/45" : e.id === "normal" ? "bg-brand/70" : "bg-brand"}`} style={{ height: e.h }} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 flex justify-between text-[12.5px] text-muted"><span>{fmt(last14[0])}</span><span>Hoy</span></div>
          </>
        ) : (
          <p className="mt-2 text-muted">Registrá cómo te sentís y acá vas a ver tu evolución.</p>
        )}
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[22px] font-semibold">{months[first.getMonth()]} {first.getFullYear()}</h2>
          <div className="flex">
            <button type="button" onClick={() => setOffset(offset - 1)} aria-label="Mes anterior" className="flex size-11 items-center justify-center rounded-full hover:bg-brand-soft"><ChevronLeft size={22} /></button>
            <button type="button" onClick={() => setOffset(offset + 1)} disabled={offset >= 0} aria-label="Mes siguiente" className="flex size-11 items-center justify-center rounded-full hover:bg-brand-soft disabled:opacity-30"><ChevronRight size={22} /></button>
          </div>
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1 text-center">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i} className="py-1 text-[13px] font-bold text-muted" aria-hidden="true">{d}</span>)}
          {cells.map((k, i) => {
            if (!k) return <span key={i} />;
            const isDone = doneDates.has(k);
            const isFree = free.has(k);
            return (
              <span
                key={i}
                aria-label={`${fmt(k)}${isDone ? ": clase hecha" : isFree ? ": día libre" : ""}`}
                className={`mx-auto flex size-10 items-center justify-center rounded-full text-[15px] font-bold ${
                  isDone ? "bg-brand text-white [[data-theme=dark]_&]:text-bg" : isFree ? "bg-sage-soft text-sage" : "text-ink"
                } ${k === today ? "ring-2 ring-brand ring-offset-2 ring-offset-surface" : ""}`}
              >
                {parseKey(k).getDate()}
              </span>
            );
          })}
        </div>
        <div className="mt-4 flex gap-5 text-[14px] text-muted">
          <span className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-brand" /> Clase hecha</span>
          <span className="flex items-center gap-2"><span className="size-3.5 rounded-full bg-sage-soft ring-1 ring-sage" /> Día libre</span>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-[22px] font-semibold">Tus logros</h2>
        <ul className="mt-3 grid grid-cols-3 gap-2.5">
          {milestones.map((n) => {
            const got = done >= n;
            return (
              <li key={n} className={`flex flex-col items-center rounded-2xl p-3 text-center ${got ? "bg-brand-soft" : "bg-bg"}`}>
                <Award size={30} className={got ? "text-brand" : "text-muted/50"} />
                <span className="mt-1 font-bold">{n === total ? "Plan completo" : `Día ${n}`}</span>
                <span className="text-[13px] text-muted">{got ? "Logrado" : `Te faltan ${n - done}`}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <h2 className="font-display text-[22px] font-semibold">Tu peso <span className="font-sans text-[15px] font-normal text-muted">(opcional)</span></h2>
        <p className="mt-1 text-[15px] text-muted">Solo si te sirve. Tu avance también se mide en cómo te sentís y te movés.</p>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => { e.preventDefault(); if (kgValid) { addWeight(Math.round(kgNum * 10) / 10); setKg(""); } }}
        >
          <label htmlFor="kg" className="sr-only">Tu peso de hoy en kilos</label>
          <input
            id="kg" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} placeholder="Ej: 68,5"
            className="min-h-12 min-w-0 flex-1 rounded-2xl bg-bg px-4 ring-1 ring-line placeholder:text-muted/70"
          />
          <Button type="submit" disabled={!kgValid} className="!w-auto shrink-0">Guardar</Button>
        </form>
        {weights.length === 0 ? (
          <p className="mt-3 text-muted">Todavía no tenés registros.</p>
        ) : (
          <>
            {diff !== null && (
              <p className="mt-4 rounded-2xl bg-bg p-3 text-[15px]">
                Desde tu primer registro: <b>{diff === 0 ? "sin cambios" : `${diff > 0 ? "+" : "−"}${Math.abs(diff).toFixed(1).replace(".", ",")} kg`}</b>
              </p>
            )}
            <ul className="mt-2 divide-y divide-line">
              {[...weights].reverse().slice(0, 8).map((w) => (
                <li key={w.date} className="flex items-center justify-between py-1">
                  <span className="text-muted">{fmt(w.date)}</span>
                  <span className="flex items-center gap-1">
                    <b>{w.kg.toFixed(1).replace(".", ",")} kg</b>
                    <button type="button" onClick={() => removeWeight(w.date)} aria-label={`Borrar el registro del ${fmt(w.date)}`} className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-brand-soft"><Trash2 size={17} /></button>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </div>
  );
}
