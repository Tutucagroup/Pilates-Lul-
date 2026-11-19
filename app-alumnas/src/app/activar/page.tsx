"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, LockKeyhole, ShoppingBag } from "lucide-react";
import { Back } from "@/components/Back";
import { Button, Card, Eyebrow, PageTitle } from "@/components/ui";
import { plans } from "@/data/program";
import { money } from "@/lib/money";
import { useApp } from "@/lib/store";

const addons = plans.filter((p) => p.addon);

const errors: Record<string, string> = {
  not_found: "No encontramos esa compra con ese email. Escribí el mismo email que usaste para pagar. Si acabás de comprar, esperá un par de minutos y probá de nuevo.",
  unavailable: "No pudimos revisar tu compra en este momento. Probá de nuevo en unos minutos.",
  rate_limited: "Hubo muchos intentos seguidos. Probá de nuevo en una hora o escribinos respondiendo el mail de compra.",
  not_configured: "La activación todavía no está disponible. Escribinos respondiendo el mail de compra y te ayudamos.",
};

/**
 * Activa un plan adicional (upsell) en este dispositivo.
 * Se activa con el email de compra: el webhook de Impultienda anotó la compra (ver src/lib/entitlements.ts).
 * Un link puede traer los datos después del # (#plan=…&email=…) para no mandarlos al servidor en la
 * dirección: la página los lee, activa sola y los borra de la barra.
 */
export default function Activar() {
  const router = useRouter();
  const owned = useApp((s) => s.owned);
  const savedEmail = useApp((s) => s.activationEmail);
  const unlockPlan = useApp((s) => s.unlockPlan);
  const setActivePlan = useApp((s) => s.setActivePlan);

  const [planId, setPlanId] = useState(addons[0]?.id ?? "");
  const [email, setEmail] = useState(savedEmail ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoTried = useRef(false);

  const plan = addons.find((p) => p.id === planId);
  const done = plan ? owned.includes(plan.id) : false;

  const activate = async (pid: string, em: string) => {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/activar", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan: pid, email: em }),
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
    if (pid && addons.some((p) => p.id === pid)) setPlanId(pid);
    if (em) setEmail(em);
    if (window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    const target = pid || addons[0]?.id;
    if (target && em && !useApp.getState().owned.includes(target)) void activate(target, em);
    // activate usa setters estables del store: alcanza con correr esto una vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!plan) {
    return (
      <div className="animate-fade-up pt-1">
        <Back href="/programa" label="Programa" />
        <PageTitle title="Ya tenés todos los planes" subtitle="Los 2 programas vienen incluidos en tu compra: no hace falta activar nada." />
        <Link href="/programa" className="mt-2 inline-flex font-bold text-brand underline">Ir a Programa</Link>
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
              <strong className="text-ink">{plan.name}</strong> es un plan adicional ({plan.classes.length} clases). Si lo compraste, escribí el email que usaste para pagar. Se activa una sola vez en cada celular o compu donde uses la app.
            </p>
          </div>
          <form
            className="mt-4 space-y-3"
            onSubmit={(e) => { e.preventDefault(); if (email.trim()) void activate(plan.id, email.trim()); }}
          >
            <div>
              <label htmlFor="act-email" className="font-bold">Email con el que compraste</label>
              <input
                id="act-email" type="email" inputMode="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 min-h-12 w-full rounded-2xl bg-bg px-4 ring-1 ring-line"
              />
            </div>
            {error ? <p className="text-[15px] font-bold text-red-700 [[data-theme=dark]_&]:text-red-300" role="alert">{error}</p> : null}
            <Button type="submit" disabled={busy}>{busy ? "Activando…" : "Activar plan"}</Button>
          </form>
        </Card>
      )}

      {!done && plan.addon?.buyUrl ? (
        <Card>
          <Eyebrow>¿Todavía no lo tenés?</Eyebrow>
          <h2 className="mt-1 font-display text-[22px] font-semibold leading-tight">Sumá {plan.name}</h2>
          <p className="mt-1 text-[15.5px] text-muted">
            {plan.subtitle} · {plan.classes.length} clases. Con el reto de 28 días tenés el programa completo de Pilates Lulú.
          </p>
          <p className="mt-3 text-[32px] font-extrabold leading-none text-ink">{money(plan.addon.price)}</p>
          <p className="mt-1 text-[14px] text-muted">Pago único</p>
          <a
            href={buyLink(plan.addon.buyUrl, savedEmail)}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-brand px-5 py-3 text-[17px] font-bold text-white hover:bg-brand-dark [[data-theme=dark]_&]:text-bg"
          >
            <ShoppingBag size={19} /> Sumalo por {money(plan.addon.price)}
          </a>
          <p className="mt-3 text-[14px] text-muted">
            Después de pagar, volvé a esta pantalla y escribí el email que usaste en la compra.
          </p>
        </Card>
      ) : null}
    </div>
  );
}

/** Link de compra del upsell con el email ya escrito en el checkout, si lo conocemos. */
function buyLink(buyUrl: string, email: string | null): string {
  if (!email) return buyUrl;
  try {
    const u = new URL(buyUrl);
    u.searchParams.set("email", email);
    return u.toString();
  } catch {
    return buyUrl;
  }
}
