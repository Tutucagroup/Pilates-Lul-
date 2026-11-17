import { recipes, type Meal, type Recipe } from "@/data/recipes";

export type Diet = "todo" | "vegetariana" | "vegana" | "sin gluten";
export const MEALS: Meal[] = ["desayuno", "almuerzo", "merienda", "cena"];

function allowed(r: Recipe, diet: Diet): boolean {
  if (diet === "todo") return true;
  if (diet === "vegetariana") return r.tags.includes("vegetariana") || r.tags.includes("vegana");
  return r.tags.includes(diet);
}

export function optionsFor(meal: Meal, diet: Diet): Recipe[] {
  const list = recipes.filter((r) => r.meal === meal && allowed(r, diet));
  return list.length ? list : recipes.filter((r) => r.meal === meal);
}

/** Comida del día: rota entre las recetas permitidas. `swap` avanza a la siguiente opción. */
export function mealFor(day: number, meal: Meal, diet: Diet, swap = 0): Recipe {
  const list = optionsFor(meal, diet);
  const offset = MEALS.indexOf(meal) * 2;
  return list[(day - 1 + offset + swap) % list.length];
}
