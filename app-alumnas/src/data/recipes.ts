export type Meal = "desayuno" | "almuerzo" | "merienda" | "cena";
export type Tag = "vegetariana" | "vegana" | "sin gluten" | "proteica" | "rápida";

export type Recipe = {
  id: string;
  name: string;
  meal: Meal;
  minutes: number;
  tags: Tag[];
  emoji: string;
  intro: string;
  ingredients: string[];
  steps: string[];
};

export const mealLabel: Record<Meal, string> = {
  desayuno: "Desayuno", almuerzo: "Almuerzo", merienda: "Merienda", cena: "Cena",
};

const r = (
  id: string, name: string, meal: Meal, minutes: number, tags: Tag[], emoji: string,
  intro: string, ingredients: string[], steps: string[],
): Recipe => ({ id, name, meal, minutes, tags, emoji, intro, ingredients, steps });

/** Porciones: todas las recetas rinden 1 porción, salvo que se indique. */
export const recipes: Recipe[] = [
  // Desayunos
  r("yogur-frutas-semillas", "Yogur con fruta y semillas", "desayuno", 5, ["vegetariana", "sin gluten", "rápida"], "🥣",
    "Fresco, liviano y listo en dos minutos.",
    ["1 pote de yogur natural sin azúcar", "1 fruta de estación en cubos", "1 cucharada de semillas de chía o girasol", "Canela a gusto"],
    ["Poné el yogur en un bowl.", "Sumá la fruta cortada.", "Terminá con las semillas y un poco de canela."]),
  r("tostadas-palta-huevo", "Tostadas con palta y huevo", "desayuno", 10, ["vegetariana", "proteica", "rápida"], "🥑",
    "Un desayuno que te deja satisfecha hasta el mediodía.",
    ["2 rodajas de pan integral", "1/2 palta madura", "1 huevo", "Jugo de limón, sal y pimienta"],
    ["Tostá el pan.", "Pisá la palta con limón, sal y pimienta y untala.", "Hacé el huevo a la plancha o duro y ponelo arriba."]),
  r("avena-manzana", "Avena tibia con manzana", "desayuno", 10, ["vegetariana", "rápida"], "🍎",
    "Reconfortante para las mañanas frías.",
    ["4 cucharadas de avena", "1 taza de leche o bebida vegetal", "1/2 manzana rallada", "Canela y 1 cucharadita de miel"],
    ["Calentá la leche con la avena a fuego bajo, revolviendo, 4 minutos.", "Agregá la manzana rallada y la canela.", "Serví y endulzá con la miel."]),
  r("licuado-banana-mani", "Licuado de banana y maní", "desayuno", 5, ["vegetariana", "sin gluten", "proteica", "rápida"], "🥤",
    "Para los días en que salís apurada.",
    ["1 banana madura", "1 vaso de leche o bebida vegetal", "1 cucharada de pasta de maní sin azúcar", "Hielo a gusto"],
    ["Poné todo en la licuadora.", "Licuá un minuto hasta que quede cremoso.", "Tomalo en el momento."]),
  r("omelette-queso-tomate", "Omelette de queso y tomate", "desayuno", 10, ["vegetariana", "sin gluten", "proteica", "rápida"], "🍳",
    "Salado, rápido y con buena proteína.",
    ["2 huevos", "1 feta de queso fresco", "1/2 tomate en cubitos", "Orégano, sal y un chorrito de aceite"],
    ["Batí los huevos con sal.", "Volcalos en una sartén aceitada a fuego medio.", "Cuando cuaje abajo, poné el queso y el tomate, doblá y cociná un minuto más."]),
  r("tostadas-ricota-miel", "Tostadas con ricota y miel", "desayuno", 5, ["vegetariana", "rápida"], "🍯",
    "Dulce sin ser pesado.",
    ["2 rodajas de pan integral", "3 cucharadas de ricota", "1 cucharadita de miel", "Nueces picadas"],
    ["Tostá el pan.", "Untá la ricota.", "Sumá la miel y las nueces."]),

  // Almuerzos
  r("pollo-plancha-ensalada", "Pollo a la plancha con ensalada tibia", "almuerzo", 25, ["sin gluten", "proteica"], "🍗",
    "Un clásico que nunca falla.",
    ["1 filet de pechuga de pollo", "1/2 zapallito y 1/2 zanahoria en rodajas", "Hojas verdes", "Aceite de oliva, limón, sal y pimienta"],
    ["Condimentá el pollo y cocinalo a la plancha 6 minutos por lado.", "En la misma sartén salteá las verduras 5 minutos.", "Serví sobre las hojas verdes con aceite y limón."]),
  r("lentejas-verduras", "Guiso liviano de lentejas", "almuerzo", 35, ["vegana", "sin gluten", "proteica"], "🍲",
    "Rinde 2 porciones. Guardá una para otro día.",
    ["1 taza de lentejas remojadas", "1/2 cebolla, 1 zanahoria y 1/2 morrón picados", "1 tomate rallado", "Pimentón, laurel, sal y aceite"],
    ["Rehogá la cebolla, la zanahoria y el morrón.", "Sumá el tomate, las lentejas y los condimentos.", "Cubrí con agua y cociná 25 minutos, hasta que estén tiernas."]),
  r("tarta-acelga", "Tarta de acelga sin tapa", "almuerzo", 40, ["vegetariana"], "🥧",
    "Rinde 4 porciones. Se puede freezar.",
    ["1 tapa de tarta integral", "1 atado de acelga hervida y picada", "2 huevos y 3 cucharadas de ricota", "1/2 cebolla rehogada, nuez moscada y sal"],
    ["Mezclá la acelga con la cebolla, los huevos y la ricota. Condimentá.", "Forrá una tartera con la masa y volcá el relleno.", "Horno medio 30 minutos, hasta que esté firme y dorada."]),
  r("arroz-integral-atun", "Ensalada de arroz integral y atún", "almuerzo", 15, ["sin gluten", "proteica", "rápida"], "🍚",
    "Ideal para llevar en un táper.",
    ["1 taza de arroz integral cocido", "1 lata de atún al natural", "1 tomate y 1/2 zanahoria rallada", "Aceite de oliva, limón y sal"],
    ["Mezclá el arroz con el atún escurrido.", "Sumá el tomate en cubos y la zanahoria.", "Condimentá con aceite, limón y sal."]),
  r("fideos-verduras", "Fideos integrales con verduras salteadas", "almuerzo", 20, ["vegana"], "🍝",
    "Pasta sí, con muchas verduras.",
    ["1 plato de fideos integrales", "1/2 zapallito, 1/2 berenjena y 1/2 cebolla en tiras", "1 diente de ajo", "Aceite de oliva, sal y albahaca"],
    ["Herví los fideos según el paquete.", "Salteá las verduras con el ajo 8 minutos.", "Mezclá con los fideos y terminá con albahaca."]),
  r("milanesa-berenjena", "Milanesas de berenjena al horno", "almuerzo", 35, ["vegetariana"], "🍆",
    "Crocantes y sin freír. Rinde 2 porciones.",
    ["1 berenjena grande en rodajas", "1 huevo batido", "Pan rallado integral con orégano", "Ensalada de tomate para acompañar"],
    ["Salá las rodajas y dejalas 10 minutos. Secalas.", "Pasalas por huevo y pan rallado.", "Horno fuerte 12 minutos por lado. Serví con la ensalada."]),
  r("bowl-garbanzos", "Bowl de garbanzos y verduras", "almuerzo", 15, ["vegana", "sin gluten", "proteica", "rápida"], "🥗",
    "Con garbanzos de lata sale en un rato.",
    ["1 taza de garbanzos cocidos", "1 tomate, 1/2 pepino y 1/4 de cebolla morada", "1/2 palta", "Limón, aceite de oliva, sal y perejil"],
    ["Cortá las verduras en cubos.", "Mezclalas con los garbanzos.", "Sumá la palta, condimentá y terminá con perejil."]),

  // Meriendas
  r("fruta-frutos-secos", "Fruta con frutos secos", "merienda", 2, ["vegana", "sin gluten", "rápida"], "🍐",
    "La merienda más simple.",
    ["1 fruta de estación", "1 puñado chico de nueces o almendras"],
    ["Lavá y cortá la fruta.", "Acompañala con los frutos secos."]),
  r("mate-tostada-queso", "Infusión con tostada y queso", "merienda", 5, ["vegetariana", "rápida"], "🧉",
    "Para acompañar el mate o el té.",
    ["1 rodaja de pan integral", "1 feta de queso fresco", "Rodajas de tomate", "Mate, té o café sin azúcar"],
    ["Tostá el pan.", "Poné el queso y el tomate.", "Acompañá con tu infusión."]),
  r("bastones-hummus", "Bastones de verdura con hummus", "merienda", 10, ["vegana", "sin gluten", "rápida"], "🥕",
    "Crocante y saciante.",
    ["1 zanahoria y 1 rama de apio en bastones", "3 cucharadas de hummus"],
    ["Cortá las verduras en bastones.", "Serví con el hummus para untar."]),
  r("galletas-avena-banana", "Galletas de avena y banana", "merienda", 25, ["vegana"], "🍪",
    "Solo dos ingredientes base. Rinde 8 galletas.",
    ["2 bananas maduras", "1 taza de avena", "Canela y pasas de uva (opcional)"],
    ["Pisá las bananas y mezclá con la avena y la canela.", "Formá bolitas, aplastalas sobre una placa aceitada.", "Horno medio 15 minutos."]),
  r("yogur-avena", "Yogur con avena y canela", "merienda", 3, ["vegetariana", "rápida"], "🥛",
    "Rápida y rendidora.",
    ["1 pote de yogur natural", "2 cucharadas de avena", "Canela"],
    ["Mezclá el yogur con la avena.", "Espolvoreá canela y dejá reposar un minuto."]),

  // Cenas
  r("sopa-calabaza", "Sopa crema de calabaza", "cena", 30, ["vegana", "sin gluten"], "🎃",
    "Liviana para la noche. Rinde 2 porciones.",
    ["1/2 calabaza en cubos", "1/2 cebolla y 1 zanahoria", "Caldo de verduras o agua", "Sal, pimienta y nuez moscada"],
    ["Hervir las verduras cubiertas con caldo 20 minutos.", "Licuar o pisar hasta que quede cremosa.", "Condimentar y servir caliente."]),
  r("merluza-limon", "Merluza al horno con limón", "cena", 25, ["sin gluten", "proteica"], "🐟",
    "Pescado fácil, sin olor en la cocina.",
    ["1 filet de merluza", "Rodajas de limón y 1 diente de ajo picado", "1 papa chica en rodajas finas", "Aceite de oliva, perejil y sal"],
    ["Poné las papas en una fuente aceitada y horneá 10 minutos.", "Sumá el pescado con ajo, limón y sal.", "Horno 12 minutos más. Terminá con perejil."]),
  r("revuelto-zapallitos", "Revuelto de zapallitos", "cena", 15, ["vegetariana", "sin gluten", "proteica", "rápida"], "🥒",
    "Sale con lo que hay en la heladera.",
    ["2 zapallitos en cubos", "1/2 cebolla picada", "2 huevos", "Queso rallado, sal y pimienta"],
    ["Rehogá la cebolla y los zapallitos 8 minutos.", "Agregá los huevos batidos y revolvé hasta que cuajen.", "Terminá con un poco de queso rallado."]),
  r("ensalada-completa", "Ensalada completa con huevo", "cena", 15, ["vegetariana", "sin gluten", "rápida"], "🥬",
    "Una ensalada que es plato.",
    ["Hojas verdes y 1 tomate", "1 huevo duro", "1/2 lata de choclo y 1 zanahoria rallada", "Aceite de oliva, vinagre y sal"],
    ["Lavá y cortá las verduras.", "Sumá el choclo y el huevo en cuartos.", "Condimentá a gusto."]),
  r("wok-verduras-tofu", "Salteado de verduras con tofu", "cena", 20, ["vegana", "proteica"], "🥢",
    "Mucho sabor en una sola sartén.",
    ["150 g de tofu firme en cubos", "1/2 morrón, 1 zanahoria y 1/2 cebolla en tiras", "1 cucharada de salsa de soja", "Aceite y semillas de sésamo"],
    ["Dorá el tofu y reservalo.", "Salteá las verduras a fuego fuerte 6 minutos.", "Volvé a sumar el tofu con la salsa de soja y terminá con sésamo."]),
  r("zapallo-relleno", "Zapallitos rellenos", "cena", 35, ["vegetariana", "sin gluten"], "🫑",
    "Rinde 2 porciones.",
    ["2 zapallitos redondos", "1/2 cebolla picada", "1 huevo y 3 cucharadas de queso rallado", "Sal, pimienta y orégano"],
    ["Herví los zapallitos 8 minutos, cortalos al medio y ahuecalos.", "Rehogá la cebolla con la pulpa, mezclá con el huevo y el queso.", "Rellená y gratiná en horno fuerte 15 minutos."]),
  r("pollo-verduras-horno", "Pollo al horno con verduras", "cena", 40, ["sin gluten", "proteica"], "🍽️",
    "Todo en una fuente. Rinde 2 porciones.",
    ["2 patas o muslos de pollo sin piel", "1 batata, 1 cebolla y 1 zanahoria en trozos", "Aceite de oliva, pimentón, romero y sal"],
    ["Poné todo en una fuente y condimentá.", "Horno medio 35 minutos, dando vuelta a mitad de cocción.", "Serví caliente."]),
];

export const getRecipe = (id: string) => recipes.find((x) => x.id === id);
