"use client";
import { useState } from "react";
import { brand } from "@/config/brand.config";
import { useQuiz } from "@/funnel/store";
import { buildCartUrl } from "@/lib/checkout";
import { price } from "@/lib/pricing";
import { logQuizEvent, newEventId, trackMeta } from "@/lib/tracking/client";
import { Button } from "../ui/Button";

const configured = !brand.shopify.domain.startsWith("TIENDA") && !/^0+$/.test(brand.shopify.variantId);

type Props = { label: string; level: string; stepIndex: number; stepName: string; position: "top" | "bottom" };

/** Botón de compra: InitiateCheckout (Pixel + CAPI, mismo event_id) y redirección al cart permalink de Shopify. */
export function BuyButton({ label, level, stepIndex, stepName, position }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = () => {
    if (!configured) {
      setError("Falta configurar el dominio y el variant ID de Shopify en brand.config.ts.");
      return;
    }
    setBusy(true);
    const s = useQuiz.getState();
    const eventId = newEventId("ic");
    if (brand.meta.sendInitiateCheckout) {
      trackMeta(
        "InitiateCheckout",
        { value: price.offer, currency: price.currency, content_ids: [brand.shopify.variantId], content_type: "product", num_items: 1 },
        eventId,
      );
    }
    logQuizEvent({ event: "checkout", stepId: "oferta", stepIndex, stepName, value: { position, eventId } });
    window.location.href = buildCartUrl({
      domain: brand.shopify.domain,
      variantId: brand.shopify.variantId,
      sessionId: s.sessionId,
      attribution: s.attribution,
      checkoutEventId: eventId,
      variants: s.variants,
      level,
    });
  };

  return (
    <div>
      <Button variant="buy" onClick={buy} disabled={busy} className="min-h-14 text-[19px]">
        {busy ? "Abriendo el pago seguro…" : label}
      </Button>
      {error ? <p className="mt-2 text-center text-[14px] text-red-700">{error}</p> : null}
    </div>
  );
}
