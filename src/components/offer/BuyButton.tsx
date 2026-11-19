"use client";
import { useState } from "react";
import { brand } from "@/config/brand.config";
import { useQuiz } from "@/funnel/store";
import { buildCheckoutUrl } from "@/lib/checkout";
import { price } from "@/lib/pricing";
import { logQuizEvent, newEventId, trackMeta } from "@/lib/tracking/client";
import { Button } from "../ui/Button";

const configured = /^https:\/\//.test(brand.impultienda.checkoutUrl);

type Props = { label: string; level: string; stepId: string; stepIndex: number; stepName: string; position: "top" | "bottom" };

/** Botón de compra: InitiateCheckout (Pixel + CAPI, mismo event_id) y redirección al checkout de Impultienda. */
export function BuyButton({ label, level, stepId, stepIndex, stepName, position }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = () => {
    if (!configured) {
      setError("Falta configurar el link del checkout de Impultienda en brand.config.ts.");
      return;
    }
    setBusy(true);
    const s = useQuiz.getState();
    const eventId = newEventId("ic");
    if (brand.meta.sendInitiateCheckout) {
      trackMeta(
        "InitiateCheckout",
        {
          value: price.offer,
          currency: price.currency,
          content_ids: [brand.impultienda.productId],
          content_type: "product",
          num_items: 1,
        },
        eventId,
      );
    }
    logQuizEvent({ event: "checkout", stepId, stepIndex, stepName, value: { position, eventId, level } });
    window.location.href = buildCheckoutUrl({
      checkoutUrl: brand.impultienda.checkoutUrl,
      attribution: s.attribution,
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
