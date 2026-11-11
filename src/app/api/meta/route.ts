import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { brand } from "@/config/brand.config";

/**
 * Conversions API de Meta. Recibe el mismo event_id que mandó el Pixel
 * para que Meta deduplique. Purchase NO pasa por acá: lo manda Shopify.
 */
const ALLOWED = new Set(["PageView", "quiz_step", "Lead", "InitiateCheckout"]);
const sha256 = (s: string) => createHash("sha256").update(s.trim().toLowerCase()).digest("hex");

export async function POST(req: NextRequest) {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!brand.meta.pixelId || !token) return new NextResponse(null, { status: 204 });

  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const eventName = String(b.eventName ?? "");
  const eventId = String(b.eventId ?? "").slice(0, 100);
  if (!ALLOWED.has(eventName) || !eventId) return new NextResponse(null, { status: 400 });

  const fbp = req.cookies.get("_fbp")?.value;
  let fbc = req.cookies.get("_fbc")?.value;
  const sourceUrl = typeof b.eventSourceUrl === "string" ? b.eventSourceUrl.slice(0, 1000) : brand.siteUrl;
  if (!fbc) {
    try {
      const fbclid = new URL(sourceUrl).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch {}
  }
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? undefined;
  const sessionId = typeof b.sessionId === "string" && b.sessionId ? b.sessionId : undefined;

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: {
          client_ip_address: ip,
          client_user_agent: req.headers.get("user-agent") ?? undefined,
          fbp,
          fbc,
          external_id: sessionId ? [sha256(sessionId)] : undefined,
          country: [sha256(brand.country.toLowerCase())],
        },
        custom_data: b.customData && typeof b.customData === "object" ? b.customData : undefined,
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  const res = await fetch(
    `https://graph.facebook.com/${brand.meta.graphApiVersion}/${brand.meta.pixelId}/events?access_token=${encodeURIComponent(token)}`,
    { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) },
  ).catch((e) => {
    console.error("CAPI", e);
    return null;
  });
  if (res && !res.ok) console.error("CAPI", res.status, await res.text());
  return new NextResponse(null, { status: 204 });
}
