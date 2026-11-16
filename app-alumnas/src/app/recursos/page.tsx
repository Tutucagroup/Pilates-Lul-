import Link from "next/link";
import { BookOpenText, ChevronRight, ExternalLink } from "lucide-react";
import { Back } from "@/components/Back";
import { Eyebrow, PageTitle } from "@/components/ui";
import { resources } from "@/data/resources";

export default function Recursos() {
  return (
    <div className="animate-fade-up pt-1">
      <Back />
      <PageTitle title="Recursos" subtitle="Guías y materiales para acompañar tu reto" />

      <Eyebrow className="mb-2">Incluido en tu reto</Eyebrow>
      <Link href="/guia" className="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><BookOpenText size={22} /></span>
        <span className="flex-1">
          <span className="block font-bold">Guía de bienvenida</span>
          <span className="block text-[15px] text-muted">Hábitos y consejos para tus 28 días</span>
        </span>
        <ChevronRight className="text-muted" size={20} />
      </Link>

      {resources.length > 0 ? (
        <>
          <Eyebrow className="mb-2 mt-6">Más materiales</Eyebrow>
          <ul className="space-y-2.5">
            {resources.map((r) => (
              <li key={r.title}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="block rounded-2xl bg-surface p-4 ring-1 ring-line">
                  <span className="text-[12px] font-extrabold uppercase tracking-wider text-muted">{r.kind}</span>
                  <span className="mt-0.5 flex items-start justify-between gap-3">
                    <span className="font-bold leading-snug">{r.title}</span>
                    <ExternalLink size={18} className="mt-1 shrink-0 text-muted" />
                  </span>
                  <span className="mt-1 block text-[15px] text-muted">{r.description}</span>
                  {r.price && <span className="mt-2 inline-block rounded-full bg-brand-soft px-3 py-1 text-[15px] font-bold text-brand-dark">{r.price}</span>}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-6 rounded-3xl bg-surface p-6 text-center text-muted ring-1 ring-line">Pronto vas a encontrar acá más guías y materiales.</p>
      )}
    </div>
  );
}
