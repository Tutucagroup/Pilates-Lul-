"use client";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { mealLabel } from "@/data/recipes";
import { MEALS, mealFor, optionsFor } from "@/lib/mealplan";
import { useApp } from "@/lib/store";

/** Comidas del día del reto, adaptadas a la alimentación elegida. */
export function MealPlan({ day }: { day: number }) {
  const diet = useApp((s) => s.profile?.diet ?? "todo");
  const swaps = useApp((s) => s.swaps);
  const swapMeal = useApp((s) => s.swapMeal);

  return (
    <ul className="space-y-2.5">
      {MEALS.map((meal) => {
        const key = `${day}-${meal}`;
        const recipe = mealFor(day, meal, diet, swaps[key] ?? 0);
        const canSwap = optionsFor(meal, diet).length > 1;
        return (
          <li key={meal} className="flex items-center gap-3 rounded-2xl bg-bg p-3">
            <Link href={`/recetas/${recipe.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-[24px] ring-1 ring-line" aria-hidden="true">{recipe.emoji}</span>
              <span className="min-w-0">
                <span className="block text-[12px] font-extrabold uppercase tracking-wider text-muted">{mealLabel[meal]}</span>
                <span className="block truncate font-bold leading-snug">{recipe.name}</span>
              </span>
            </Link>
            {canSwap && (
              <button
                type="button"
                onClick={() => swapMeal(key)}
                aria-label={`Cambiar ${mealLabel[meal].toLowerCase()} por otra opción`}
                className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-brand-soft hover:text-brand-dark"
              >
                <RefreshCw size={19} />
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
