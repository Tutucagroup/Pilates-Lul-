"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useQuiz, newSessionId } from "@/funnel/store";
import { readAttribution } from "@/lib/checkout";
import { loadPixel } from "@/lib/tracking/pixel";
import { trackMeta } from "@/lib/tracking/client";

/**
 * Se monta una vez en el layout:
 *  - rehidrata el estado guardado (localStorage) y crea la sesión si no existe,
 *  - guarda UTM + fbclid de la URL de entrada,
 *  - carga el Pixel sin bloquear el render y manda PageView en cada cambio de ruta.
 */
export function QuizBoot() {
  const pathname = usePathname();
  const hydrated = useQuiz((s) => s.hydrated);

  useEffect(() => {
    Promise.resolve(useQuiz.persist.rehydrate()).then(() => {
      const s = useQuiz.getState();
      if (!s.sessionId) useQuiz.setState({ sessionId: newSessionId(), startedAt: new Date().toISOString() });
      s.mergeAttribution(readAttribution(window.location.search));
      useQuiz.setState({ hydrated: true });
      loadPixel(useQuiz.getState().sessionId);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    trackMeta("PageView");
  }, [hydrated, pathname]);

  return null;
}
