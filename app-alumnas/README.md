# Pilates Lulú · App de alumnas

El producto que recibe la alumna después de comprar: dos planes de pilates con clase diaria en video, plan de comidas, recetas, progreso y coach virtual.

Es un proyecto **independiente** de la landing (que vive en la raíz del repositorio). Tiene sus propias dependencias y se publica como **otro proyecto de Vercel**.

Next.js 15 · TypeScript · Tailwind 4 · Zustand · API de Anthropic (coach).

## Publicarla en Vercel

1. En Vercel: **Add New → Project** y elegí este mismo repositorio de GitHub.
2. En **Root Directory** poné `app-alumnas`. El resto se detecta solo (Next.js).
3. En **Environment Variables** cargá `ANTHROPIC_API_KEY` (ver "Coach virtual") y `ACTIVATION_SECRET` (ver "Plan adicional").
4. **Deploy**. Vercel te da una dirección nueva, distinta de la landing.

Cada vez que se suben cambios a la rama de producción, Vercel vuelve a publicar solo.

## Planes y videos

La app trae dos planes, con videos del canal de YouTube "Fuerte después de los 50 con Eu":

| Plan | Clases | Lista de YouTube de origen |
|---|---|---|
| Pilates Asiático · 28 días | 28 (una por día) | "Reto 28 Días Pilates. Fuerte Después de los 50!" |
| Rejuvenecé después de los 50 | 20 (5 por semana, 4 semanas) | "Reto Pilates - Mes 1" (semanas 1 y 2) y "Mes 2" (semanas 3 y 4) |

Todo está en `src/data/program.ts`. Para cambiar un video, reemplazá el ID (lo que va después de `v=` en el enlace de YouTube). Ahí mismo se editan título, duración, descripción y elementos necesarios de cada clase.

Los videos se reproducen con el reproductor de YouTube: si un video se borra, se pone en privado o se le desactiva la inserción, esa clase deja de verse.

## Dónde está cada cosa

| Archivo | Qué editás ahí |
|---|---|
| `src/data/program.ts` | Los dos planes: video, título, tipo, duración y descripción de cada clase |
| `src/data/recipes.ts` | Recetas (el plan de comidas diario se arma solo a partir de estas) |
| `src/data/tips.ts` | Tip del día (28) |
| `src/data/faq.ts` | Preguntas frecuentes de la pantalla Ayuda |
| `src/data/resources.ts` | Ebooks y guías de la pantalla Recursos |
| `src/data/contact.ts` | Email, WhatsApp e Instagram de contacto |
| `src/lib/coach-prompt.ts` | Personalidad y límites de la coach |
| `src/app/globals.css` | Colores de marca (modo claro y oscuro) |

## Plan adicional (Rejuvenecé después de los 50)

"Rejuvenecé después de los 50" se vende aparte, como upsell de $5.900 en el checkout de Impultienda. En `src/data/program.ts` está marcado con `addon: true`: aparece con candado en **Programa** hasta que se activa.

- Quien lo compra recibe un mail con un botón que abre `/activar` y lo activa solo, y un código `ABCD-EFGH` para escribir a mano junto con su email. El código a mano hace falta en la app instalada del iPhone, que no comparte lo guardado en Safari.
- `/api/activar` verifica el código con `ACTIVATION_SECRET`, que tiene que ser **el mismo valor** que en el proyecto de la landing (ahí lo calcula el webhook de Impultienda). Hay un tope de 15 intentos fallidos por hora por IP.
- La activación queda guardada en ese dispositivo: en otro celular se activa de nuevo con el mismo mail. "Borrar todos mis datos" no la quita.
- `src/lib/activation.ts` está copiado igual en la landing (`src/lib/activation.ts`): si cambiás uno, cambiá el otro.

## Coach virtual

El chat llama a `/api/coach`, que usa la API de Anthropic desde el servidor.

- Creá una clave en https://platform.claude.com y cargala en Vercel como `ANTHROPIC_API_KEY`. Nunca la subas al repositorio.
- Sin la clave, la app funciona igual y el chat avisa que la coach todavía no está activa.
- Cada mensaje tiene costo. Hay un tope de 20 mensajes por día por alumna (`NEXT_PUBLIC_COACH_DAILY_LIMIT`) y un tope básico por IP en el servidor. Conviene además fijar un límite de gasto mensual en la consola de Anthropic.
- El modelo se cambia con `COACH_MODEL`.

## Limitaciones actuales

- **No hay cuentas ni control de acceso.** Cualquiera que tenga la dirección puede entrar al reto de 28 días. El plan adicional se desbloquea con un código, pero el candado vive en el navegador: alguien con conocimientos técnicos podría saltearlo. Para que solo entren quienes compraron hace falta sumar inicio de sesión y enlazarlo con la compra.
- **El progreso se guarda en el dispositivo** (almacenamiento del navegador). No se sincroniza entre celulares y se pierde si se borran los datos del navegador.
- **Los videos son públicos en YouTube.** Cualquiera puede verlos gratis en el canal, sin pasar por la app.

## Desarrollo local

```bash
npm install
```

```bash
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run build` | Build de producción |
| `npm test` | Tests de la racha |
| `npm run typecheck` / `npm run lint` | Tipos y lint |
