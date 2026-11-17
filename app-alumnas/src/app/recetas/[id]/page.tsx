"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, Heart } from "lucide-react";
import { Card, LinkButton } from "@/components/ui";
import { getRecipe, mealLabel } from "@/data/recipes";
import { useApp } from "@/lib/store";

export default function RecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const recipe = getRecipe(id);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);

  if (!recipe) {
    return (
      <div className="pt-10 text-center">
        <p className="font-display text-[24px] font-semibold">No encontramos esa receta</p>
        <LinkButton href="/recetas" className="mt-5">Ver todas las recetas</LinkButton>
      </div>
    );
  }
  const fav = favorites.includes(recipe.id);

  return (
    <div className="animate-fade-up pt-1">
      <div className="flex items-center justify-between">
        <button type="button" onClick={() => router.back()} className="-ml-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-bold text-muted">
          <ArrowLeft size={19} /> Volver
        </button>
        <button
          type="button" onClick={() => toggleFavorite(recipe.id)} aria-pressed={fav}
          aria-label={fav ? "Quitar de favoritas" : "Guardar en favoritas"}
          className={`flex size-11 items-center justify-center rounded-full ${fav ? "bg-brand-soft text-brand" : "text-muted hover:bg-brand-soft"}`}
        >
          <Heart size={22} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-2 flex h-36 items-center justify-center rounded-3xl bg-brand-soft text-[72px]" aria-hidden="true">{recipe.emoji}</div>

      <p className="mt-5 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-brand">{mealLabel[recipe.meal]}</p>
      <h1 className="mt-1 font-display text-[28px] font-semibold leading-tight">{recipe.name}</h1>
      <p className="mt-2 text-[18px] text-muted">{recipe.intro}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        <li className="flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[15px] font-bold ring-1 ring-line"><Clock size={15} /> {recipe.minutes} min</li>
        {recipe.tags.map((t) => <li key={t} className="rounded-full bg-sage-soft px-3 py-1.5 text-[15px] font-bold capitalize text-sage">{t}</li>)}
      </ul>

      <Card className="mt-5">
        <h2 className="font-display text-[22px] font-semibold">Ingredientes</h2>
        <ul className="mt-3 space-y-2.5">
          {recipe.ingredients.map((i) => (
            <li key={i} className="flex gap-3"><span className="mt-[9px] size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />{i}</li>
          ))}
        </ul>
      </Card>
      <Card className="mt-3">
        <h2 className="font-display text-[22px] font-semibold">Preparación</h2>
        <ol className="mt-3 space-y-3.5">
          {recipe.steps.map((s, n) => (
            <li key={n} className="flex gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft font-bold text-brand-dark" aria-hidden="true">{n + 1}</span>
              <span className="pt-0.5">{s}</span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
