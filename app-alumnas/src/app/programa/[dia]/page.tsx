"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Clock, Feather, Lock, MessageCircleHeart, PartyPopper, Video } from "lucide-react";
import { Button, Card, Eyebrow, LinkButton } from "@/components/ui";
import { TOTAL_DAYS, getClass } from "@/data/program";
import { youtubeId } from "@/data/videos";
import { isUnlocked, useApp, type Feeling } from "@/lib/store";

const feelings: { id: Feeling; label: string }[] = [
  { id: "facil", label: "Me resultó fácil" },
  { id: "justa", label: "Estuvo justa" },
  { id: "exigente", label: "Me costó" },
];

export default function ClassPage() {
  const { dia } = useParams<{ dia: string }>();
  const day = Number(dia);
  const cls = getClass(day);
  const completions = useApp((s) => s.completions);
  const completeDay = useApp((s) => s.completeDay);
  const uncompleteDay = useApp((s) => s.uncompleteDay);
  const setFeeling = useApp((s) => s.setFeeling);
  const [justDone, setJustDone] = useState(false);

  if (!cls) {
    return (
      <div className="pt-10 text-center">
        <p className="font-display text-[24px] font-semibold">No encontramos esa clase</p>
        <LinkButton href="/programa" className="mt-5">Volver al programa</LinkButton>
      </div>
    );
  }
  if (!isUnlocked(day, completions)) {
    return (
      <div className="pt-10 text-center">
        <Lock className="mx-auto text-muted" size={36} />
        <p className="mt-3 font-display text-[24px] font-semibold">Esta clase todavía no está habilitada</p>
        <p className="mt-1 text-muted">Completá el día {day - 1} para abrirla.</p>
        <LinkButton href={`/programa/${day - 1}`} className="mt-5">Ir al día {day - 1}</LinkButton>
      </div>
    );
  }

  const completion = completions[day];
  const vid = youtubeId(day);
  const isLast = day === TOTAL_DAYS;

  return (
    <div className="animate-fade-up pt-1">
      <Link href="/programa" className="-ml-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-bold text-muted">
        <ArrowLeft size={19} /> Programa
      </Link>

      <div className="-mx-4 mt-1 aspect-video bg-black min-[520px]:mx-0 min-[520px]:overflow-hidden min-[520px]:rounded-3xl">
        {vid ? (
          <iframe
            className="size-full"
            src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1`}
            title={`Día ${day}: ${cls.title}`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 bg-brand-soft px-6 text-center text-ink">
            <Video className="text-brand" size={34} />
            <p className="font-bold">Video en preparación</p>
            <p className="text-[14px] text-muted">Esta clase todavía no tiene su video cargado.</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <Eyebrow>Día {day} · {cls.category}</Eyebrow>
        <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight">{cls.title}</h1>
        <p className="mt-2 flex items-center gap-1.5 font-bold text-muted"><Clock size={17} /> {cls.minutes} minutos</p>
        <p className="mt-3 text-[18px] leading-relaxed">{cls.description}</p>
      </div>

      <div className="mt-5 space-y-3">
        <Card>
          <h2 className="font-bold">Qué vas a trabajar</h2>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {cls.focus.map((f) => <li key={f} className="rounded-full bg-brand-soft px-3 py-1.5 text-[15px] font-bold text-brand-dark">{f}</li>)}
          </ul>
        </Card>
        <Card className="!bg-sage-soft !ring-0">
          <h2 className="flex items-center gap-2 font-bold text-sage"><Feather size={19} /> Variante suave</h2>
          <p className="mt-1.5">{cls.gentle}</p>
        </Card>
      </div>

      <div className="mt-6">
        {!completion ? (
          <Button onClick={() => { completeDay(day); setJustDone(true); }}>
            <Check size={20} strokeWidth={3} /> Marcar como hecha
          </Button>
        ) : (
          <Card className="text-center" >
            <div aria-live="polite">
              {justDone
                ? <PartyPopper className="animate-pop mx-auto text-brand" size={40} />
                : <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-sage text-white [[data-theme=dark]_&]:text-bg"><Check size={26} strokeWidth={3} /></span>}
              <h2 className="mt-2 font-display text-[24px] font-semibold">
                {isLast ? "Completaste los 28 días" : justDone ? `Día ${day} cumplido` : "Clase hecha"}
              </h2>
              {justDone && <p className="mt-1 text-muted">{isLast ? "Qué orgullo. Lo lograste." : "Un paso más. Así se construye."}</p>}
            </div>

            <p className="mt-5 font-bold">¿Cómo la sentiste?</p>
            <div className="mt-2.5 grid grid-cols-3 gap-2" role="group" aria-label="Cómo sentiste la clase">
              {feelings.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={completion.feeling === f.id}
                  onClick={() => setFeeling(day, f.id)}
                  className={`min-h-14 rounded-2xl px-2 py-2 text-[14.5px] font-bold leading-tight ring-1 ${
                    completion.feeling === f.id ? "bg-brand-soft text-brand-dark ring-brand" : "bg-bg ring-line"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {!isLast && <LinkButton href={`/programa/${day + 1}`} variant="soft" className="mt-5">Ver la clase del día {day + 1}</LinkButton>}
            <LinkButton href="/" variant="ghost" className="mt-2.5">Volver al inicio</LinkButton>
            <button type="button" onClick={() => { uncompleteDay(day); setJustDone(false); }} className="mt-3 min-h-11 text-[14px] font-bold text-muted underline">
              La marqué por error
            </button>
          </Card>
        )}
      </div>

      <Link href={`/coach?clase=${day}`} className="mt-4 flex min-h-12 items-center justify-center gap-2 font-bold text-sage">
        <MessageCircleHeart size={20} /> Preguntarle a la coach sobre esta clase
      </Link>
    </div>
  );
}
