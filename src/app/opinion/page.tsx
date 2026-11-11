import type { Metadata } from "next";
import { brand } from "@/config/brand.config";
import { Logo } from "@/components/Logo";
import { ReviewForm } from "./ReviewForm";

export const metadata: Metadata = {
  title: `Dejá tu opinión · ${brand.name}`,
  robots: { index: false, follow: false },
};

export default function OpinionPage() {
  return (
    <>
      <header className="flex h-14 items-center justify-center">
        <Logo />
      </header>
      <main className="mx-auto max-w-md px-4 pb-12 pt-4">
        <h1 className="text-[26px] font-extrabold leading-tight">¿Cómo te fue con el {brand.program.name.toLowerCase()}?</h1>
        <p className="mt-2 text-[17px] text-muted">
          Tu experiencia ayuda a otras mujeres a decidirse. Revisamos cada reseña antes de publicarla.
        </p>
        <ReviewForm />
      </main>
    </>
  );
}
