"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { CalendarHeart, ChartNoAxesColumn, LayoutGrid, Menu, MessageCircleHeart, Moon, Salad, Sun } from "lucide-react";
import { useApp } from "@/lib/store";
import { Logo } from "./Logo";
import { Onboarding } from "./Onboarding";

const tabs = [
  { href: "/", label: "Inicio", icon: CalendarHeart },
  { href: "/programa", label: "Programa", icon: LayoutGrid },
  { href: "/progreso", label: "Progreso", icon: ChartNoAxesColumn },
  { href: "/recetas", label: "Recetas", icon: Salad },
  { href: "/mas", label: "Más", icon: Menu },
];
const moreRoutes = ["/mas", "/ayuda", "/guia", "/recursos", "/perfil", "/coach"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const profile = useApp((s) => s.profile);
  const theme = useApp((s) => s.theme);
  const toggleTheme = useApp((s) => s.toggleTheme);
  // El estado vive en el navegador: esperamos a montar para no mostrar datos vacíos.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (ready) document.documentElement.dataset.theme = theme;
  }, [ready, theme]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center" aria-busy="true">
        <Logo />
      </div>
    );
  }
  if (!profile) return <Onboarding />;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href === "/mas" ? moreRoutes.some((r) => pathname.startsWith(r)) : pathname.startsWith(href);
  const onCoach = pathname.startsWith("/coach");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[520px] flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-bg/90 px-4 py-3 backdrop-blur">
        <Link href="/" aria-label="Ir al inicio"><Logo /></Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
          className="flex size-11 items-center justify-center rounded-full text-muted hover:bg-brand-soft"
        >
          {theme === "dark" ? <Sun size={21} /> : <Moon size={21} />}
        </button>
      </header>

      <main className={`flex-1 px-4 ${onCoach ? "pb-36" : "pb-32"}`}>{children}</main>

      {!onCoach && (
        <Link
          href="/coach"
          aria-label="Abrir el chat con la coach Lulú"
          className="fixed bottom-24 right-4 z-30 flex size-14 items-center justify-center rounded-full bg-sage text-white shadow-lg shadow-black/15 [[data-theme=dark]_&]:text-bg min-[520px]:right-[calc(50%-244px)]"
        >
          <MessageCircleHeart size={26} />
        </Link>
      )}

      {!onCoach && <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[520px] border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
      >
        <ul className="grid grid-cols-5">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-16 flex-col items-center justify-center gap-0.5 text-[12.5px] font-bold ${active ? "text-brand" : "text-muted"}`}
                >
                  <span className={`flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-brand-soft" : ""}`}>
                    <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>}
    </div>
  );
}
