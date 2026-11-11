import { funnel } from "@/config/funnel.config";
import { StepScreen } from "@/components/StepScreen";
import { ResumeBanner } from "@/components/ResumeBanner";

/** Primer paso del funnel (se renderiza estático para un LCP rápido). */
export default function Home() {
  return (
    <>
      <StepScreen stepId={funnel.steps[0].id} />
      <ResumeBanner />
    </>
  );
}
