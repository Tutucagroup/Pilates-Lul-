import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { funnel } from "@/config/funnel.config";
import { StepScreen } from "@/components/StepScreen";

export const dynamicParams = false;

export function generateStaticParams() {
  return funnel.steps.slice(1).map((s) => ({ step: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ step: string }> }): Promise<Metadata> {
  const { step } = await params;
  // Solo la portada se indexa.
  return { robots: { index: false, follow: false }, alternates: step === "oferta" ? undefined : { canonical: "/" } };
}

export default async function StepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (step === funnel.steps[0].id) redirect("/");
  if (!funnel.steps.some((s) => s.id === step)) notFound();
  return <StepScreen stepId={step} />;
}
