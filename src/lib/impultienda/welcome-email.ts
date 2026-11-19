/**
 * Mail de bienvenida que sale después de cada compra del reto.
 * Texto fuente: entrega/mail-confirmacion-compra.md. Si cambiás uno, cambiá el otro.
 *
 * HTML para clientes de correo: tablas y estilos en línea (Gmail y Outlook ignoran <style> y CSS moderno).
 */

const C = {
  bg: "#faf8f5",
  card: "#ffffff",
  text: "#2b2326",
  muted: "#6b5f63",
  rose: "#a85566", // mismo color principal que la tienda en Impultienda
  roseSoft: "#f6e7ea",
  border: "#ecdfe1",
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export type WelcomeEmailInput = {
  firstName: string;
  email: string;
  appUrl: string;
  logoUrl: string;
  /** true = aviso de prueba del panel de Impultienda: el asunto lo dice. */
  test?: boolean;
};

const p = (html: string, extra = "") =>
  `<p style="margin:0 0 16px;font:16px/1.6 ${FONT};color:${C.text};${extra}">${html}</p>`;
const h2 = (html: string) =>
  `<h2 style="margin:32px 0 12px;font:700 20px/1.3 ${FONT};color:${C.text};">${html}</h2>`;
const h3 = (html: string) => `<p style="margin:20px 0 8px;font:700 16px/1.4 ${FONT};color:${C.rose};">${html}</p>`;
const button = (label: string, href: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 24px;">
    <tr><td align="center" bgcolor="${C.rose}" style="border-radius:12px;">
      <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:16px 32px;font:700 17px/1 ${FONT};color:#ffffff;text-decoration:none;border-radius:12px;">${label}</a>
    </td></tr>
  </table>`;
const list = (items: string[], ordered = false) => {
  const tag = ordered ? "ol" : "ul";
  return `<${tag} style="margin:0 0 16px;padding-left:22px;font:16px/1.6 ${FONT};color:${C.text};">${items
    .map((t) => `<li style="margin:0 0 6px;">${t}</li>`)
    .join("")}</${tag}>`;
};
const box = (html: string) =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
    <tr><td bgcolor="${C.roseSoft}" style="border-left:4px solid ${C.rose};border-radius:8px;padding:14px 16px;font:15px/1.6 ${FONT};color:${C.text};">${html}</td></tr>
  </table>`;



function layout(subject: string, preheader: string, body: string, logoUrl: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.bg}">
  <tr><td align="center" style="padding:24px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td align="center" style="padding:8px 0 24px;">
        <img src="${escapeHtml(logoUrl)}" width="220" alt="Pilates Lulú" style="display:block;width:220px;max-width:70%;height:auto;border:0;">
      </td></tr>
      <tr><td bgcolor="${C.card}" style="border:1px solid ${C.border};border-radius:16px;padding:32px 24px;">
${body}
      </td></tr>
      <tr><td style="padding:24px 8px 8px;font:13px/1.6 ${FONT};color:${C.muted};text-align:center;">
        ¿Tenés alguna duda o no podés entrar? Respondé este mail y te ayudamos.<br><br>
        <em>Recordá consultar con tu médico antes de empezar cualquier actividad física si tenés alguna lesión o condición de salud. Los resultados varían según cada persona.</em>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function welcomeEmail(i: WelcomeEmailInput): { subject: string; html: string; text: string } {
  const subject = `${i.test ? "[Prueba] " : ""}¡Bienvenida a Pilates Lulú! 🌸 Tu acceso ya está listo`;
  const preheader = "Entrá a tu app con el mismo email con el que compraste.";
  const hello = i.firstName ? `¡Hola, ${escapeHtml(i.firstName)}!` : "¡Hola!";
  const email = escapeHtml(i.email);
  const app = escapeHtml(i.appUrl);

  const body = [
    p(hello, "font-size:18px;font-weight:700;"),
    p(
      `<strong>Tu compra se confirmó con éxito.</strong> ¡Gracias por sumarte al Reto de 28 días de Pilates Asiático y a Rejuvenecé después de los 50! Desde hoy formás parte de la comunidad de Pilates Lulú y estamos muy felices de acompañarte.`,
    ),
    h2("👉 Tu acceso"),
    p("Entrá a tu app de alumna desde este botón:"),
    button("ENTRAR A MI APP", i.appUrl),
    p(
      `O copiá este link en tu navegador: <a href="${app}" style="color:${C.rose};">${app}</a>`,
      `font-size:14px;color:${C.muted};`,
    ),
    box(
      `🔒 <strong>Importante:</strong> tu acceso está habilitado <strong>solo para el email con el que hiciste la compra</strong> (${email}). Cuando entres, usá siempre ese mismo email. Si usás otro, la app no te va a dejar pasar.<br>Por eso te pedimos que <strong>no compartas tu link</strong>: es personal.`,
    ),
    p("Adentro vas a encontrar:", "margin-bottom:8px;"),
    list([
      "Una clase en video para cada día del reto, a tu ritmo y desde tu casa.",
      "El plan <strong>Rejuvenecé después de los 50</strong>: 20 rutinas cortas para quemar grasa y tonificar todo el cuerpo. Lo elegís en <strong>Programa</strong>.",
      "Tu plan de comidas con recetas simples.",
      "Tu progreso y tu racha de días.",
      "Una coach virtual para resolver tus dudas.",
    ]),
    h2("📲 Tené tu app en el celular"),
    p("Guardá el acceso directo en la pantalla de inicio y vas a entrar con un solo toque, sin buscar este mail."),
    h3("Si tenés iPhone (Safari)"),
    list(
      [
        `Abrí el link <a href="${app}" style="color:${C.rose};">${app}</a> <strong>desde Safari</strong> (no desde Instagram ni Gmail).`,
        "Tocá el botón <strong>Compartir</strong> (el cuadradito con la flecha hacia arriba, abajo en el centro).",
        "Deslizá hacia abajo y tocá <strong>“Agregar a pantalla de inicio”</strong>.",
        "Tocá <strong>“Agregar”</strong> arriba a la derecha.",
      ],
      true,
    ),
    h3("Si tenés Android (Chrome)"),
    list(
      [
        `Abrí el link <a href="${app}" style="color:${C.rose};">${app}</a> <strong>desde Chrome</strong>.`,
        "Tocá los <strong>tres puntitos</strong> de arriba a la derecha.",
        "Tocá <strong>“Agregar a la pantalla principal”</strong> (en algunos celulares dice <strong>“Instalar app”</strong>).",
        "Confirmá con <strong>“Agregar”</strong> o <strong>“Instalar”</strong>.",
      ],
      true,
    ),
    p("¡Listo! Vas a ver el ícono de Pilates Lulú junto a tus otras apps. 💛"),
    box(
      "💡 Si abriste el link desde Instagram, Facebook o el mail y no ves esas opciones, tocá los tres puntitos y elegí <strong>“Abrir en el navegador”</strong> (o “Abrir en Safari / Chrome”), y seguí los pasos.",
    ),
    h2("🌿 Este es tu momento"),
    p("Elegiste algo muy valioso: dedicarte unos minutos por día a vos."),
    p(
      "Con Pilates Lulú vas a ir sintiendo el cambio clase a clase: <strong>más bienestar</strong> y energía para tu día, <strong>más movilidad</strong> y menos rigidez en la espalda, las caderas y las articulaciones, un cuerpo que <strong>se va desinflamando y bajando de peso</strong>, y una <strong>alimentación más ordenada</strong>, sin dietas imposibles ni culpa.",
    ),
    p(
      "No hace falta ser perfecta, hace falta ser constante. Con unos 15 minutos por día alcanza. Cada clase que hacés es un regalo para tu cuerpo de hoy y para tu bienestar de mañana.",
    ),
    p("<strong>Tu primera clase ya te está esperando. ¿Arrancamos hoy?</strong>", "text-align:center;"),
    button("EMPEZAR MI DÍA 1", i.appUrl),
    p("Con mucho cariño,<br><strong>Lulú y el equipo de Pilates Lulú</strong> 💛"),
  ].join("\n");

  const text = `${i.firstName ? `¡Hola, ${i.firstName}!` : "¡Hola!"}

Tu compra se confirmó con éxito. ¡Gracias por sumarte al Reto de 28 días de Pilates Asiático y a Rejuvenecé después de los 50!

TU ACCESO
Entrá a tu app de alumna: ${i.appUrl}

Importante: tu acceso está habilitado solo para el email con el que hiciste la compra (${i.email}). Cuando entres, usá siempre ese mismo email. Por eso te pedimos que no compartas tu link: es personal.

ADENTRO VAS A ENCONTRAR
- Una clase en video para cada día del reto.
- El plan Rejuvenecé después de los 50: 20 rutinas cortas para quemar grasa y tonificar todo el cuerpo (lo elegís en Programa).
- Tu plan de comidas, tu progreso y una coach virtual.

TENÉ TU APP EN EL CELULAR
iPhone (Safari): abrí el link desde Safari > Compartir > "Agregar a pantalla de inicio" > "Agregar".
Android (Chrome): abrí el link desde Chrome > tres puntitos > "Agregar a la pantalla principal" (o "Instalar app") > "Agregar".
Si lo abriste desde Instagram, Facebook o el mail, tocá los tres puntitos y elegí "Abrir en el navegador".

ESTE ES TU MOMENTO
Con Pilates Lulú vas a ir sintiendo el cambio clase a clase: más bienestar, más movilidad, un cuerpo que se va desinflamando y bajando de peso, y una alimentación más ordenada. Con unos 15 minutos por día alcanza.

Tu primera clase ya te está esperando: ${i.appUrl}

Con mucho cariño,
Lulú y el equipo de Pilates Lulú

¿Tenés alguna duda o no podés entrar? Respondé este mail y te ayudamos.
Recordá consultar con tu médico antes de empezar cualquier actividad física si tenés alguna lesión o condición de salud. Los resultados varían según cada persona.
`;

  return { subject, html: layout(subject, preheader, body, i.logoUrl), text };
}
