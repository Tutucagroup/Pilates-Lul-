import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { brand } from "@/config/brand.config";
import { QuizBoot } from "@/components/QuizBoot";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: `${brand.name} · ${brand.method} para mujeres +40`,
  description: `${brand.program.name} de ${brand.method}: ${brand.program.minutesPerDay} minutos por día, en tu casa, a tu ritmo. Hacé el cuestionario de 1 minuto y armamos tu plan.`,
  openGraph: {
    title: `${brand.name} · ${brand.program.name}`,
    description: `${brand.program.minutesPerDay} minutos por día de ${brand.method}, pensado para ${brand.audience}.`,
    images: ["/images/og.webp"],
    locale: "es_AR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: brand.colors.background,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={nunito.variable}>
      <body className="min-h-dvh antialiased">
        <QuizBoot />
        {children}
      </body>
    </html>
  );
}
