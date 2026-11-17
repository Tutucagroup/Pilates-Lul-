"use client";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUp, MessageCircleHeart, Trash2 } from "lucide-react";
import { getClass } from "@/data/program";
import { dateKey } from "@/lib/dates";
import { computeStreak } from "@/lib/streak";
import { allDoneDates, currentDay, doneCount, useActivePlan, useApp, type ChatMessage } from "@/lib/store";

const DAILY_LIMIT = Number(process.env.NEXT_PUBLIC_COACH_DAILY_LIMIT) || 20;
const suggestions = ["No sé qué comer hoy", "Hoy no tengo ganas", "Me molesta la espalda", "Falté unos días, ¿cómo sigo?"];
const goalText = { tonificar: "tonificar", movilidad: "ganar movilidad", espalda: "cuidar espalda y postura", energia: "más energía y menos estrés" };
const levelText = { nunca: "nunca hizo pilates", algo: "hizo algo hace tiempo", habitual: "hace ejercicio seguido" };

function Coach() {
  const params = useSearchParams();
  const classDay = Number(params.get("clase")) || null;
  const { plan, done: planDone } = useActivePlan();
  const cls = classDay ? getClass(plan, classDay) : undefined;

  const profile = useApp((s) => s.profile)!;
  const completions = useApp((s) => s.completions);
  const energy = useApp((s) => s.energy);
  const chat = useApp((s) => s.chat);
  const setChat = useApp((s) => s.setChat);
  const coachUse = useApp((s) => s.coachUse);
  const countCoachUse = useApp((s) => s.countCoachUse);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [partial, setPartial] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const today = dateKey();
  const used = coachUse.date === today ? coachUse.n : 0;
  const left = Math.max(0, DAILY_LIMIT - used);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [chat, partial, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy || left === 0) return;
    setNotice(null);
    setInput("");
    const history: ChatMessage[] = [...chat, { role: "user", content }];
    setChat(history);
    setBusy(true);
    setPartial("");
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          context: {
            name: profile.name,
            goal: goalText[profile.goal],
            level: levelText[profile.level],
            diet: profile.diet === "todo" ? "come de todo" : profile.diet,
            cares: profile.cares,
            plan: plan.name,
            totalDays: plan.classes.length,
            day: currentDay(plan, planDone),
            done: doneCount(planDone),
            streak: computeStreak(allDoneDates(completions), today).streak,
            energy: energy[today],
            classDay: cls?.day,
          },
        }),
      });
      if (res.status === 503) {
        setChat(chat);
        setInput(content);
        setNotice("La coach todavía no está activa. Mientras tanto, mirá las preguntas frecuentes en Ayuda.");
        return;
      }
      if (res.status === 429) {
        setChat(chat);
        setInput(content);
        setNotice("Por hoy se alcanzó el máximo de mensajes. Mañana podés seguir.");
        return;
      }
      if (!res.ok || !res.body) throw new Error(String(res.status));

      countCoachUse();
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setPartial(answer);
      }
      setChat([...history, { role: "assistant", content: answer.trim() || "No pude responder. Probá de nuevo." }]);
    } catch {
      setChat(chat);
      setInput(content);
      setNotice("No pudimos conectar con la coach. Revisá tu conexión y probá de nuevo.");
    } finally {
      setBusy(false);
      setPartial("");
    }
  }

  const bubble = "max-w-[86%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[17px] leading-relaxed";

  return (
    <div className="flex flex-col pt-2">
      <header className="flex items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sage text-white [[data-theme=dark]_&]:text-bg"><MessageCircleHeart size={25} /></span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[24px] font-semibold leading-tight">Coach Lulú</h1>
          <p className="text-[14px] text-muted">Asistente virtual · {left === 0 ? "sin mensajes por hoy" : `te quedan ${left} mensajes hoy`}</p>
        </div>
        {chat.length > 0 && (
          <button type="button" onClick={() => { if (confirm("¿Borrar esta conversación?")) setChat([]); }} aria-label="Borrar la conversación" className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-brand-soft">
            <Trash2 size={20} />
          </button>
        )}
      </header>

      <div className="mt-5 space-y-3" aria-live="polite">
        <div className={`${bubble} rounded-tl-lg bg-surface ring-1 ring-line`}>
          Hola, {profile.name}. Soy Lulú, tu coach virtual. {cls ? `¿Qué querés saber sobre la clase del día ${cls.day}, "${cls.title}"?` : "Preguntame sobre tus clases, qué comer o cómo sostener el reto."}
        </div>
        {chat.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
            <div className={`${bubble} ${m.role === "user" ? "rounded-tr-lg bg-brand text-white [[data-theme=dark]_&]:text-bg" : "rounded-tl-lg bg-surface ring-1 ring-line"}`}>{m.content}</div>
          </div>
        ))}
        {busy && (
          <div className={`${bubble} rounded-tl-lg bg-surface ring-1 ring-line`}>
            {partial || <span className="text-muted">Lulú está escribiendo…</span>}
          </div>
        )}
      </div>

      {chat.length === 0 && !busy && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => send(s)} disabled={left === 0} className="min-h-11 rounded-full bg-sage-soft px-4 text-[15px] font-bold text-sage disabled:opacity-50">{s}</button>
          ))}
        </div>
      )}

      {notice && (
        <p role="alert" className="mt-4 rounded-2xl bg-brand-soft p-3.5 text-[15px]">
          {notice} {notice.includes("Ayuda") && <Link href="/ayuda" className="font-bold text-brand-dark underline">Ir a Ayuda</Link>}
        </p>
      )}
      <div ref={endRef} className="h-4" />

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[520px] border-t border-line bg-surface px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="msg" className="sr-only">Escribile a la coach</label>
          <textarea
            id="msg" rows={1} value={input} maxLength={1000} disabled={left === 0}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={left === 0 ? "Mañana podés seguir escribiendo" : "Escribile a Lulú…"}
            className="max-h-32 min-h-12 flex-1 resize-none rounded-3xl bg-bg px-4 py-3 ring-1 ring-line [field-sizing:content] placeholder:text-muted/70"
          />
          <button type="submit" disabled={!input.trim() || busy || left === 0} aria-label="Enviar mensaje" className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand text-white disabled:opacity-40 [[data-theme=dark]_&]:text-bg">
            <ArrowUp size={22} strokeWidth={2.6} />
          </button>
        </div>
        <p className="mt-2 text-center text-[12.5px] text-muted">
          Lulú es inteligencia artificial y puede equivocarse. No reemplaza a tu médica o médico. <Link href="/" className="font-bold underline">Volver al inicio</Link>
        </p>
      </form>
    </div>
  );
}

export default function CoachPage() {
  return <Suspense><Coach /></Suspense>;
}
