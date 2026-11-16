"use client";
import Link from "next/link";
import { useState } from "react";
import { Clock, Heart, Search } from "lucide-react";
import { Chip, PageTitle } from "@/components/ui";
import { mealLabel, recipes, type Meal, type Tag } from "@/data/recipes";
import { useApp } from "@/lib/store";

const meals: Meal[] = ["desayuno", "almuerzo", "merienda", "cena"];
const tags: Tag[] = ["rápida", "proteica", "vegetariana", "vegana", "sin gluten"];
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function Recetas() {
  const favorites = useApp((s) => s.favorites);
  const [q, setQ] = useState("");
  const [meal, setMeal] = useState<Meal | null>(null);
  const [tag, setTag] = useState<Tag | null>(null);
  const [onlyFav, setOnlyFav] = useState(false);

  const list = recipes.filter(
    (r) =>
      (!meal || r.meal === meal) &&
      (!tag || r.tags.includes(tag) || (tag === "vegetariana" && r.tags.includes("vegana"))) &&
      (!onlyFav || favorites.includes(r.id)) &&
      (!q || norm(r.name).includes(norm(q)) || r.ingredients.some((i) => norm(i).includes(norm(q)))),
  );

  return (
    <div className="animate-fade-up pt-2">
      <PageTitle title="Recetas" subtitle="Comidas simples para acompañar tu reto" />

      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
        <label htmlFor="q" className="sr-only">Buscar receta o ingrediente</label>
        <input
          id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar receta o ingrediente"
          className="min-h-12 w-full rounded-2xl bg-surface pl-12 pr-4 ring-1 ring-line placeholder:text-muted/70"
        />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Momento del día">
        <Chip active={!meal} onClick={() => setMeal(null)}>Todas</Chip>
        {meals.map((m) => <Chip key={m} active={meal === m} onClick={() => setMeal(meal === m ? null : m)}>{mealLabel[m]}</Chip>)}
      </div>
      <div className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Tipo de comida">
        <Chip active={onlyFav} onClick={() => setOnlyFav(!onlyFav)}><span className="flex items-center gap-1.5"><Heart size={16} fill={onlyFav ? "currentColor" : "none"} /> Favoritas</span></Chip>
        {tags.map((t) => <Chip key={t} active={tag === t} onClick={() => setTag(tag === t ? null : t)}><span className="capitalize">{t}</span></Chip>)}
      </div>

      <p className="mt-4 text-[14px] font-bold text-muted" aria-live="polite">{list.length} {list.length === 1 ? "receta" : "recetas"}</p>
      {list.length === 0 ? (
        <p className="mt-6 rounded-3xl bg-surface p-6 text-center text-muted ring-1 ring-line">
          {onlyFav && favorites.length === 0 ? "Todavía no guardaste favoritas. Tocá el corazón en una receta." : "No encontramos recetas con esos filtros."}
        </p>
      ) : (
        <ul className="mt-2 space-y-2.5">
          {list.map((r) => (
            <li key={r.id}>
              <Link href={`/recetas/${r.id}`} className="flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-line">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-[28px]" aria-hidden="true">{r.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold leading-snug">{r.name}</span>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[14px] text-muted">
                    <Clock size={14} /> {r.minutes} min · {mealLabel[r.meal]}
                  </span>
                </span>
                {favorites.includes(r.id) && <Heart size={18} className="shrink-0 text-brand" fill="currentColor" aria-label="Favorita" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-center text-[14px] text-muted">Las recetas son ideas orientativas y no reemplazan el consejo de un profesional de la nutrición.</p>
    </div>
  );
}
