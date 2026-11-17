"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LockKeyhole } from "lucide-react";
import { Back } from "@/components/Back";
import { Button, Card, PageTitle } from "@/components/ui";
import { plans } from "@/data/program";
import { useApp } from "@/lib/store";

const addons = plans.filter((p) => p.addon);

const errors: Record<string, string> = {
  invalid_code: "El código no coincide con ese email. Usá el mismo email con el que compraste y el código tal cual llegó en el mail.",
  rate_limited: "Hubo muchos intentos seguidos. Probá de nuevo en una hora o escribinos respondiendo el mail de compra.",
  not_configured: "La activación todavía no está disponible. Escribinos respondiendo el mail de compra y te ayudamos.",
};

/**
 * Activa un plan adicional (upsell) en este dispositivo.
 * El link del mail trae los datos después del # (#plan=…&email=…&codigo=…) para no mandarlos al servidor
 * en la dirección: la página los lee, activa sola y los borra de la barra.
 */
export default function Activar() {
  const router = useRouter();
  const owned = useApp((s) => s.owned);
  const savedEmail = useApp((s) => s.activationEmail);
  const unlockPlan = useApp((s) => s.unlockPlan);
  const setActivePlan = useApp((s) => s.setActivePlan);

  const [planId, setPlanId] = useState(addons[0]?.id ?? "");
  const [email, setEmail] = useState(savedEmail ?? "");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoTried = useRef(false);

  const plan = addons.find((p) => p.id === planId);
  const done = plan ? owned.includes(plan.id) : false;

  const activate = async (pid: string, em: string, cd: string) => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/activar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: pid, email: em, code: cd }),
      });
      const j = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string; plan?: string; email?: string };
      if (j.ok && j.plan) {
        unlockPlan(j.plan, j.email ?? em);
        setActivePlan(j.plan);
      } else {
        setError(errors[j.error ?? ""] ?? "No pudimos activar el plan. Revisá los datos y probá de nuevo.");
      }
    } catch {
      setError("No hay conexión. Revisá tu internet y probá de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (autoTried.current) return;
    autoTried.current = true;
    const h = new URLSearchParams(window.location.hash.slice(1));
    const pid = h.get("plan") ?? "";
    const em = h.get("email") ?? "";
    const cd = h.get("codigo") ?? "";
    if (pid && addons.some((p) => p.id === pid)) setPlanId(pid);
    if (em) setEmail(em);
    if (cd) setCode(cd);
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    const target = pid || addons[0]?.id;
    if (target && em && cd && !useApp.getState().owned.includes(target)) void activate(target, em, cd);
    // activate usa setters estables del store: alcanza con correr esto una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!plan) {
    return (
      <div className="animate-fade-up pt-1">
        <Back href="/programa" label="Programa" />
        <PageTitle title="Activar un plan" subtitle="No hay planes adicionales para activar." />
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-3 pt-1">
      <Back href="/programa" label="Programa" />
      <PageTitle title="Activar un plan" subtitle={plan.name} />

      {done ? (
        <Card className="text-center">
          <CheckCircle2 className="mx-auto text-sage" size={44} />
          <h2 className="mt-2 font-display text-[24px] font-semibold">¡Plan activado!</h2>
          <p className="mt-1 text-muted">
            {plan.name} ya está en tu app{savedEmail ? ` (${savedEmail})` : ""}. Con el reto de 28 días tenés el programa completo.
          </p>
          <Button className="mt-4" onClick={() => { setActivePlan(plan.id); router.push("/programa"); }}>
            Ver mis clases
          </Button>
        </Card>
      ) : (
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><LockKeyhole size={22} /></span>
            <p className="text-[15.5px] text-muted">
              <strong className="text-ink">{plan.name}</strong> es un plan adicional ({plan.classes.length} clases). Si lo compraste, te llegó un mail con tu código. Activalo una sola vez en cada celular o compu donde uses la app.
            </p>
          </div>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => { e.preventDefault(); if (email.trim() && code.trim()) void activate(plan.id, email.trim(), code.trim()); }}
          >
            <div>
              <label htmlFor="act-email" className="font-bold">Email con el que compraste</label>
              <input
                id="act-email" type="email" inputMode="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl bg-bg px-4 ring-1 ring-line"
              />
            </div>
            <div>
              <label htmlFor="act-code" className="font-bold">Código de activación</label>
              <input
                id="act-code" required value={code} placeholder="ABCD-EFGH" autoCapitalize="characters" autoComplete="one-time-code"
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl bg-bg px-4 font-mono text-[18px] tracking-widest uppercase ring-1 ring-line placeholder:text-muted/60"
              />
            </div>
            {error ? <p className="text-[15px] font-bold text-red-700 [[data-theme=dark]_&]:text-red-300" role="alert">{error}</p> : null}
            <Button type="submit" disabled={busy}>{busy ? "Activando…" : "Activar plan"}</Button>
          </form>
        </Card>
      )}
    </div>
  );
}
