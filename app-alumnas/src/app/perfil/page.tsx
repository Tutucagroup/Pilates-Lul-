"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Back } from "@/components/Back";
import { Button, Card, Chip, PageTitle } from "@/components/ui";
import type { Diet } from "@/lib/mealplan";
import { doneCount, useApp } from "@/lib/store";

const diets: { id: Diet; label: string }[] = [
  { id: "todo", label: "Como de todo" },
  { id: "vegetariana", label: "Vegetariana" },
  { id: "vegana", label: "Vegana" },
  { id: "sin gluten", label: "Sin gluten" },
];

export default function Perfil() {
  const router = useRouter();
  const profile = useApp((s) => s.profile)!;
  const setProfile = useApp((s) => s.setProfile);
  const completions = useApp((s) => s.completions);
  const restartProgram = useApp((s) => s.restartProgram);
  const resetAll = useApp((s) => s.resetAll);
  const [name, setName] = useState(profile.name);
  const [saved, setSaved] = useState(false);

  return (
    <div className="animate-fade-up space-y-3 pt-1">
      <Back />
      <PageTitle title="Mi perfil" />

      <Card>
        <form
          onSubmit={(e) => { e.preventDefault(); if (name.trim()) { setProfile({ ...profile, name: name.trim() }); setSaved(true); } }}
        >
          <label htmlFor="name" className="font-bold">Tu nombre</label>
          <div className="mt-2 flex gap-2">
            <input
              id="name" value={name} maxLength={30} onChange={(e) => { setName(e.target.value); setSaved(false); }}
              className="min-h-12 min-w-0 flex-1 rounded-2xl bg-bg px-4 ring-1 ring-line"
            />
            <Button type="submit" disabled={!name.trim() || name.trim() === profile.name} className="!w-auto shrink-0">Guardar</Button>
          </div>
          <p className="mt-2 min-h-5 text-[14px] text-sage" aria-live="polite">{saved ? "Nombre guardado." : ""}</p>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold">Tu alimentación</h2>
        <p className="mt-0.5 text-[15px] text-muted">El plan de comidas se adapta a lo que elijas.</p>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Tu alimentación">
          {diets.map((d) => <Chip key={d.id} active={profile.diet === d.id} onClick={() => setProfile({ ...profile, diet: d.id })}>{d.label}</Chip>)}
        </div>
      </Card>

      <Card>
        <h2 className="font-bold">Reiniciar el reto</h2>
        <p className="mt-0.5 text-[15px] text-muted">
          Volvés al día 1. Se borran las {doneCount(completions)} clases marcadas; tu energía y tu peso se conservan.
        </p>
        <Button
          variant="ghost" className="mt-3" disabled={doneCount(completions) === 0}
          onClick={() => { if (confirm("¿Reiniciar el reto y volver al día 1?")) { restartProgram(); router.push("/"); } }}
        >
          Reiniciar desde el día 1
        </Button>
      </Card>

      <Card>
        <h2 className="font-bold">Borrar mis datos</h2>
        <p className="mt-0.5 text-[15px] text-muted">
          Tu progreso se guarda solo en este dispositivo. Esto lo borra por completo y no se puede deshacer.
        </p>
        <button
          type="button"
          onClick={() => { if (confirm("¿Borrar todos tus datos de este dispositivo? No se puede deshacer.")) { resetAll(); router.push("/"); } }}
          className="mt-2 min-h-11 font-bold text-brand-dark underline"
        >
          Borrar todo y empezar de cero
        </button>
      </Card>
    </div>
  );
}
