"use client";
import { useState } from "react";
import { brand } from "@/config/brand.config";
import { useQuiz } from "@/funnel/store";
import { buildCheckoutUrl } from "@/lib/checkout";
import { price } from "@/lib/pricing";
import { logQuizEvent, newEventId, trackMeta } from "@/lib/tracking/client";
import { Button } from "../ui/Button";

const configured = /^https:\/\//.test(brand.impultienda.checkoutUrl);
/** El upsell se ofrece en el quiz si tiene su ID cargado y ya es order bump en el checkout (brand.config.ts). */
export const upsellOn = brand.upsell.productId.trim() !== "" && brand.upsell.inCheckout;

type Props = { label: string; level: string; stepIndex: number; stepName: string; position: "top" | "bottom" };

/** Botón de compra: InitiateCheckout (Pixel + CAPI, mismo event_id) y redirección al checkout de Impultienda. */
export function BuyButton({ label, level, stepIndex, stepName, position }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buy = () => {
    if (!configured) {
      setError("Falta configurar el link del checkout de Impultienda en brand.config.ts.");
      return;
    }
    setBusy(true);
    const s = useQuiz.getState();
    const bump = upsellOn && s.bump;
    const eventId = newEventId("ic");
    if (brand.meta.sendInitiateCheckout) {
      const ids = [brand.impultienda.productId, ...(bump ? [brand.upsell.productId] : [])];
      trackMeta(
        "InitiateCheckout",
        {
          value: price.offer + (bump ? brand.upsell.price : 0),
          currency: price.currency,
          content_ids: ids,
          content_type: "product",
          num_items: ids.length,
        },
        eventId,
      );
    }
    logQuizEvent({ event: "checkout", stepId: "oferta", stepIndex, stepName, value: { position, eventId, level, bump } });
    window.location.href = buildCheckoutUrl({
      checkoutUrl: brand.impultienda.checkoutUrl,
      attribution: s.attribution,
      upsells: bump ? [brand.upsell.checkoutPosition] : [],
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
