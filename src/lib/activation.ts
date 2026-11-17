import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Código de activación de un plan adicional (upsell) de la app de alumnas.
 *
 * El webhook de Impultienda lo calcula con el email de la compradora y lo manda por mail.
 * La app lo verifica en su servidor con el mismo secreto. No hace falta base de datos.
 *
 * ⚠️ Este archivo está copiado igual en src/lib/activation.ts (la landing) y app-alumnas/src/lib/activation.ts.
 *    Si cambiás uno, cambiá el otro: si no coinciden, los códigos dejan de servir.
 *    Las dos apps leen el secreto de la variable ACTIVATION_SECRET (mismo valor en los dos proyectos de Vercel).
 */

/** Sin 0/O ni 1/I, para que no se confundan al copiarlo a mano. 32 letras: cada una sale de 5 bits sin sesgo. */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const normalizeCode = (code: string) => code.toUpperCase().replace(/[^A-Z0-9]/g, "");

/** "ABCD-EFGH": 8 caracteres (40 bits) derivados de HMAC-SHA256(secreto, plan + email). */
export function activationCode(email: string, planId: string, secret: string): string {
  const mac = createHmac("sha256", secret).update(`v1:${planId}:${normalizeEmail(email)}`).digest();
  let out = "";
  for (let i = 0; i < 8; i++) out += ALPHABET[mac[i] % 32];
  return `${out.slice(0, 4)}-${out.slice(4)}`;
}

export function checkActivationCode(email: string, planId: string, code: string, secret: string): boolean {
  const expected = Buffer.from(normalizeCode(activationCode(email, planId, secret)));
  const given = Buffer.from(normalizeCode(code));
  return given.length === expected.length && timingSafeEqual(given, expected);
}
