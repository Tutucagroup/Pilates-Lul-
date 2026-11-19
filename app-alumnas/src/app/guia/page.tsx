import { Back } from "@/components/Back";
import { Card, LinkButton, PageTitle } from "@/components/ui";

const sections = [
  {
    title: "Cómo funciona",
    items: [
      "Hay dos planes. Elegí uno en Programa; podés cambiar cuando quieras.",
      "Pilates Asiático - Reto 28 días: una clase por día. Rejuvenecé y Adelgazá después de los 50: cinco rutinas cortas por semana.",
      "Al terminar la clase, marcala como hecha para habilitar la siguiente.",
      "Tenés un día libre por semana sin perder la racha.",
    ],
  },
  {
    title: "Qué necesitás",
    items: [
      "Una colchoneta, o una manta doblada sobre una alfombra.",
      "Ropa cómoda y los pies descalzos o con medias antideslizantes.",
      "Algunas clases piden una silla, una toalla o un libro grueso. Te lo avisamos antes de empezar.",
      "Un vaso de agua a mano.",
    ],
  },
  {
    title: "Antes de cada clase",
    items: [
      "Elegí un horario que puedas repetir todos los días.",
      "Esperá al menos una hora después de una comida abundante.",
      "Avisá en casa que son tus minutos, y silenciá el celular.",
    ],
  },
  {
    title: "Durante la clase",
    items: [
      "La respiración manda: si la perdés, frená y retomá.",
      "Pocas repeticiones bien hechas valen más que muchas apuradas.",
      "Bajá la intensidad cada vez que lo necesites: menos recorrido, menos repeticiones o una pausa.",
      "Sentir el músculo trabajar es normal. Un dolor agudo o punzante no: frená.",
    ],
  },
  {
    title: "Fuera de la colchoneta",
    items: [
      "Mirá el plan de comidas del día: son ideas simples, sin dietas.",
      "Registrá tu energía en Progreso para conocer tus ritmos.",
      "Si tenés una duda, escribile a la coach Lulú desde el botón verde.",
    ],
  },
];

export default function Guia() {
  return (
    <div className="animate-fade-up pt-1">
      <Back />
      <PageTitle title="Guía de bienvenida" subtitle="Leela una vez antes de tu primera clase. Son tres minutos." />
      <div className="space-y-3">
        {sections.map((s, i) => (
          <Card key={s.title}>
            <h2 className="flex items-center gap-3 font-display text-[21px] font-semibold">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-soft font-sans text-[16px] font-bold text-brand-dark" aria-hidden="true">{i + 1}</span>
              {s.title}
            </h2>
            <ul className="mt-3 space-y-2.5">
              {s.items.map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-[9px] size-2 shrink-0 rounded-full bg-brand" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </Card>
        ))}
        <Card className="!bg-sage-soft !ring-0">
          <h2 className="font-bold text-sage">Importante</h2>
          <p className="mt-1.5">Este programa es de bienestar general y no reemplaza la atención médica. Si tenés una condición de salud, una cirugía reciente o estás embarazada, consultá con tu médica o médico antes de empezar.</p>
        </Card>
      </div>
      <LinkButton href="/programa" className="mt-5">Elegir mi plan</LinkButton>
    </div>
  );
}
