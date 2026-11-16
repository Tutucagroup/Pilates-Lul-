export type Category = "Fundamentos" | "Fuerza" | "Movilidad" | "Postura" | "Equilibrio" | "Estiramiento" | "Integración";

export type ClassDay = {
  day: number;
  title: string;
  category: Category;
  /** Duración en minutos. Ajustala a la duración real de cada video. */
  minutes: number;
  description: string;
  focus: string[];
  /** Variante suave para quien tiene molestias o recién empieza. */
  gentle: string;
};

export const weeks = [
  { n: 1, name: "Despertar", text: "Aprendés la respiración y los movimientos base. Sin apuro." },
  { n: 2, name: "Fortalecer", text: "Sumamos fuerza suave en centro, piernas y espalda." },
  { n: 3, name: "Fluir", text: "Los movimientos se encadenan y el cuerpo gana soltura." },
  { n: 4, name: "Integrar", text: "Juntás todo lo aprendido y cerrás tu reto." },
] as const;

const d = (
  day: number, title: string, category: Category, minutes: number,
  description: string, focus: string[], gentle: string,
): ClassDay => ({ day, title, category, minutes, description, focus, gentle });

export const program: ClassDay[] = [
  // Semana 1 · Despertar
  d(1, "Respirá y conectá con tu centro", "Fundamentos", 15,
    "Tu primera clase. Aprendés la respiración que vas a usar todo el reto y cómo activar el abdomen sin tensar el cuello.",
    ["Respiración costal", "Abdomen profundo", "Postura neutra"],
    "Si te cuesta estar boca arriba, poné un almohadón bajo la cabeza y otro bajo las rodillas."),
  d(2, "Columna que se mueve", "Movilidad", 15,
    "Movimientos lentos para despertar la espalda vértebra por vértebra. Ideal para arrancar el día sin rigidez.",
    ["Movilidad de columna", "Cintura", "Respiración"],
    "Hacé los giros con menos recorrido y apoyá las manos en una silla si lo necesitás."),
  d(3, "Piernas livianas", "Fundamentos", 15,
    "Trabajo suave de piernas y cadera acostada y de costado. Ayuda a la circulación y a sentir las piernas más ágiles.",
    ["Cadera", "Muslos", "Circulación"],
    "Reducí la altura de la pierna y descansá entre series todo lo que haga falta."),
  d(4, "Espalda sin tensión", "Postura", 15,
    "Abrís el pecho y soltás hombros y cuello. Una clase para quienes pasan muchas horas sentadas o cargando peso.",
    ["Hombros", "Cuello", "Zona dorsal"],
    "Hacela sentada en una silla firme si en el piso sentís molestias."),
  d(5, "Abdomen suave", "Fuerza", 15,
    "Primeros ejercicios de centro, cuidando la zona lumbar y el suelo pélvico. Poca cantidad, bien hecha.",
    ["Abdomen", "Zona lumbar", "Suelo pélvico"],
    "Mantené la cabeza apoyada en la colchoneta y trabajá solo con las piernas."),
  d(6, "Equilibrio y pies", "Equilibrio", 15,
    "Ejercicios de pie para ganar estabilidad y despertar los pies y tobillos. Tené una pared o silla cerca.",
    ["Pies y tobillos", "Estabilidad", "Postura de pie"],
    "Hacé todo con una mano apoyada en la pared."),
  d(7, "Repaso con calma", "Integración", 18,
    "Cerrás tu primera semana repasando lo aprendido en una secuencia completa y tranquila.",
    ["Cuerpo completo", "Respiración", "Coordinación"],
    "Salteá cualquier ejercicio que te resulte incómodo y volvé a la respiración."),

  // Semana 2 · Fortalecer
  d(8, "Centro más firme", "Fuerza", 15,
    "Subimos un escalón en el trabajo de abdomen, siempre con la espalda protegida.",
    ["Abdomen", "Cintura", "Control"],
    "Apoyá un pie en el piso en los ejercicios con las dos piernas arriba."),
  d(9, "Glúteos y cadera", "Fuerza", 15,
    "Puentes y trabajo de costado para glúteos fuertes, que son los que cuidan tus rodillas y tu espalda.",
    ["Glúteos", "Cadera", "Parte posterior de piernas"],
    "Subí la cadera solo hasta donde no sientas la zona lumbar."),
  d(10, "Brazos y hombros", "Fuerza", 15,
    "Tonificás brazos y espalda alta sin pesas. Si querés, sumá dos botellitas de agua.",
    ["Brazos", "Hombros", "Espalda alta"],
    "Hacelo sin peso y con los codos más cerca del cuerpo."),
  d(11, "Cintura y giros", "Movilidad", 15,
    "Rotaciones y flexiones laterales para una cintura más móvil y una espalda más suelta.",
    ["Oblicuos", "Columna", "Costillas"],
    "Girá menos y mantené las dos caderas apoyadas."),
  d(12, "Espalda fuerte", "Postura", 15,
    "Ejercicios boca abajo y en cuatro apoyos para fortalecer la musculatura que te mantiene erguida.",
    ["Espalda", "Glúteos", "Postura"],
    "Poné una toalla doblada bajo las rodillas y bajo la panza si te molesta el apoyo."),
  d(13, "Piernas fuertes de pie", "Fuerza", 15,
    "Sentadillas suaves, elevaciones de talones y trabajo de apoyo en una pierna, con ayuda de una silla.",
    ["Muslos", "Pantorrillas", "Equilibrio"],
    "Sentate y parate de la silla en lugar de hacer la sentadilla en el aire."),
  d(14, "Estirá todo el cuerpo", "Estiramiento", 18,
    "Mitad del reto. Una clase larga de estiramientos para recuperar y celebrar lo que ya lograste.",
    ["Flexibilidad", "Relajación", "Recuperación"],
    "No fuerces ninguna postura: llegá hasta donde sientas un estiramiento agradable."),

  // Semana 3 · Fluir
  d(15, "Secuencia fluida de centro", "Fuerza", 15,
    "Encadenás ejercicios de abdomen sin pausas largas. El objetivo es el ritmo, no la cantidad.",
    ["Abdomen", "Coordinación", "Respiración"],
    "Hacé una pausa de dos respiraciones entre ejercicios."),
  d(16, "Cadera libre", "Movilidad", 15,
    "Movilidad profunda de cadera para caminar, agacharte y subir escaleras con más comodidad.",
    ["Cadera", "Ingles", "Zona lumbar"],
    "Usá almohadones bajo las rodillas en las posturas sentadas."),
  d(17, "Postura elegante", "Postura", 15,
    "Trabajo de espalda alta, cuello y hombros para pararte y caminar más erguida.",
    ["Espalda alta", "Cuello", "Pecho"],
    "Hacé la clase sentada en el borde de una silla."),
  d(18, "Equilibrio en movimiento", "Equilibrio", 15,
    "Desplazamientos y cambios de peso de pie. Entrenás el equilibrio que usás en la vida diaria.",
    ["Estabilidad", "Tobillos", "Centro"],
    "Mantené siempre una mano cerca de la pared."),
  d(19, "Piernas y glúteos en cadena", "Fuerza", 15,
    "Una secuencia continua para piernas y glúteos, de costado y en cuatro apoyos.",
    ["Glúteos", "Muslos", "Cadera"],
    "Bajá la cantidad de repeticiones a la mitad."),
  d(20, "Columna flexible", "Movilidad", 15,
    "Flexión, extensión y giro de columna en una misma clase. Para sentir la espalda larga y liviana.",
    ["Columna", "Abdomen", "Espalda"],
    "Evitá las extensiones profundas y quedate en el rango cómodo."),
  d(21, "Fluir de principio a fin", "Integración", 18,
    "Tercera semana cumplida. Una clase completa donde cada ejercicio lleva al siguiente.",
    ["Cuerpo completo", "Ritmo", "Coordinación"],
    "Seguí la clase a tu tiempo, aunque quedes un ejercicio atrás."),

  // Semana 4 · Integrar
  d(22, "Centro completo", "Fuerza", 15,
    "Abdomen, cintura y espalda en una sola clase. Todo lo que aprendiste sobre tu centro, junto.",
    ["Abdomen", "Oblicuos", "Zona lumbar"],
    "Elegí la versión con la cabeza apoyada en cada ejercicio."),
  d(23, "Fuerza de cuerpo entero", "Fuerza", 15,
    "Brazos, piernas y centro trabajando a la vez con ejercicios combinados.",
    ["Brazos", "Piernas", "Centro"],
    "Separá los ejercicios combinados: primero piernas, después brazos."),
  d(24, "Movilidad profunda", "Movilidad", 15,
    "Recorrés todas las articulaciones con movimientos amplios y lentos.",
    ["Hombros", "Cadera", "Columna"],
    "Achicá el recorrido de cada movimiento y respirá más lento."),
  d(25, "Postura y respiración", "Postura", 15,
    "Volvés a la respiración del día 1, ahora con una espalda más fuerte. Vas a notar la diferencia.",
    ["Respiración", "Espalda", "Calma"],
    "Hacela acostada con las rodillas flexionadas."),
  d(26, "Equilibrio y control", "Equilibrio", 15,
    "Los ejercicios de equilibrio más desafiantes del reto, siempre con apoyo disponible.",
    ["Estabilidad", "Centro", "Concentración"],
    "Quedate en la versión con las dos manos en la silla."),
  d(27, "Tu clase completa", "Integración", 20,
    "La clase más completa del reto: calentamiento, fuerza, movilidad y estiramiento.",
    ["Cuerpo completo", "Resistencia", "Fluidez"],
    "Dividila en dos partes y descansá unos minutos en el medio."),
  d(28, "Celebrá tu recorrido", "Estiramiento", 18,
    "Último día. Una clase suave para agradecerle a tu cuerpo y cerrar tus 28 días.",
    ["Estiramiento", "Relajación", "Cierre"],
    "Hacé solo lo que te resulte placentero. Hoy es para disfrutar."),
];

export const TOTAL_DAYS = program.length;
export const getClass = (day: number) => program.find((c) => c.day === day);
export const weekOf = (day: number) => Math.min(4, Math.ceil(day / 7));
