import { createHmac } from "node:crypto";
import { BlobNotFoundError, head, put } from "@vercel/blob";

/**
 * Compras de cada alumna, guardadas en Vercel Blob (almacenamiento privado "pilates-lulu-accesos").
 *
 * El webhook de Impultienda anota qué planes compró cada email; la app de alumnas lo consulta
 * cuando alguien activa un plan adicional escribiendo su email de compra.
 *
 * No se guarda el email: la ruta usa un HMAC del email con ACTIVATION_SECRET
 * (compras/<hmac>/<plan>), así que sin el secreto no se puede saber quién compró.
 *
 * ⚠️ Este archivo está copiado igual en src/lib/entitlements.ts (la landing) y
 *    app-alumnas/src/lib/entitlements.ts. Si cambiás uno, cambiá el otro.
 *    Las dos apps necesitan ACTIVATION_SECRET (mismo valor) y BLOB_READ_WRITE_TOKEN (mismo almacenamiento).
 */

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** Identificador del email dentro del almacenamiento (no se puede volver atrás al email). */
export function emailKey(email: string, secret: string): string {
  return createHmac("sha256", secret).update(`v1:${normalizeEmail(email)}`).digest("hex").slice(0, 40);
}

const pathFor = (email: string, planId: string, secret: string) =>
  `compras/${emailKey(email, secret)}/${planId.replace(/[^a-z0-9-]/gi, "")}`;

/** Anota que este email compró estos planes. Repetirlo no duplica nada. */
export async function grantPlans(email: string, planIds: string[], secret: string): Promise<void> {
  await Promise.all(
    planIds.map((planId) =>
      put(pathFor(email, planId, secret), "1", {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "text/plain",
      }),
    ),
  );
}

/** ¿Este email compró este plan? */
export async function hasPlan(email: string, planId: string, secret: string): Promise<boolean> {
  try {
    await head(pathFor(email, planId, secret));
    return true;
  } catch (e) {
    if (e instanceof BlobNotFoundError) return false;
    throw e;
  }
}
