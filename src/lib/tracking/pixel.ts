"use client";
import { brand } from "@/config/brand.config";

/** Inyecta el snippet oficial de fbq (sin bloquear el render) e inicializa el Pixel. */
export function loadPixel(externalId?: string) {
  if (!brand.meta.pixelId || typeof window === "undefined" || window.fbq) return;
  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s.parentNode!.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  window.fbq!("init", brand.meta.pixelId, externalId ? { external_id: externalId } : {});
}
