import Link from "next/link";
import { BookOpenText, ChevronRight, CircleHelp, LibraryBig, MessageCircleHeart, UserRound } from "lucide-react";
import { PageTitle } from "@/components/ui";

const items = [
  { href: "/coach", icon: MessageCircleHeart, title: "Coach Lulú", text: "Tu asistente virtual para dudas del reto" },
  { href: "/guia", icon: BookOpenText, title: "Guía de bienvenida", text: "Cómo aprovechar tu plan" },
  { href: "/recursos", icon: LibraryBig, title: "Recursos", text: "Guías y materiales extra" },
  { href: "/perfil", icon: UserRound, title: "Mi perfil", text: "Tus datos, alimentación y reinicio del plan" },
  { href: "/ayuda", icon: CircleHelp, title: "Ayuda", text: "Preguntas frecuentes e instalación" },
];

export default function Mas() {
  return (
    <div className="animate-fade-up pt-2">
      <PageTitle title="Más" />
      <ul className="space-y-2.5">
        {items.map(({ href, icon: Icon, title, text }) => (
          <li key={href}>
            <Link href={href} className="flex items-center gap-3 rounded-2xl bg-surface p-4 ring-1 ring-line">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={22} /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{title}</span>
                <span className="block text-[15px] text-muted">{text}</span>
              </span>
              <ChevronRight className="shrink-0 text-muted" size={20} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
