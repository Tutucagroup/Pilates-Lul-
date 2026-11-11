"use client";
import Link from "next/link";
import { Logo } from "./Logo";

type Props = { backHref?: string | null; progress?: number | null };

/** Cabecera fija: flecha para volver, logo y barra de progreso. */
export function Header({ backHref, progress }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto flex h-14 max-w-md items-center px-2">
        <div className="w-12">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Volver al paso anterior"
              className="flex h-12 w-12 items-center justify-center rounded-full text-ink hover:bg-brand-soft"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ) : null}
        </div>
        <div className="flex flex-1 justify-center">
          <Logo />
        </div>
        <div className="w-12" />
      </div>
      {progress != null ? (
        <div
          className="mx-auto h-1.5 max-w-md px-4"
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div className="h-full overflow-hidden rounded-full bg-brand-soft">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(3, progress * 100)}%` }}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
