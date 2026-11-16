# Pilates Lulú · App de alumnas

El producto que recibe la alumna después de comprar: reto de 28 días con clase diaria en video, plan de comidas, recetas, progreso y coach virtual.

Es un proyecto **independiente** de la landing (que vive en la raíz del repositorio). Tiene sus propias dependencias y se publica como **otro proyecto de Vercel**.

Next.js 15 · TypeScript · Tailwind 4 · Zustand · API de Anthropic (coach).

## Publicarla en Vercel

1. En Vercel: **Add New → Project** y elegí este mismo repositorio de GitHub.
2. En **Root Directory** poné `app-alumnas`. El resto se detecta solo (Next.js).
3. En **Environment Variables** cargá `ANTHROPIC_API_KEY` (ver "Coach virtual").
4. **Deploy**. Vercel te da una dirección nueva, distinta de la landing.

Cada vez que se suben cambios a la rama de producción, Vercel vuelve a publicar solo.

## Cargar los 28 videos

1. Subí cada video a YouTube con visibilidad **No listado**.
2. Abrí `src/data/videos.ts` y pegá el enlace de cada día entre las comillas.
3. Si la duración real no es la que figura, ajustá `minutes` en `src/data/program.ts`.

Mientras un día no tenga enlace, la clase muestra "Video en preparación".

## Dónde está cada cosa

| Archivo | Qué editás ahí |
|---|---|
| `src/data/videos.ts` | Enlace de YouTube de cada una de las 28 clases |
| `src/data/program.ts` | Título, tipo, duración, descripción y variante suave de cada clase |
| `src/data/recipes.ts` | Recetas (el plan de comidas diario se arma solo a partir de estas) |
| `src/data/tips.ts` | Tip del día (28) |
| `src/data/faq.ts` | Preguntas frecuentes de la pantalla Ayuda |
| `src/data/resources.ts` | Ebooks y guías de la pantalla Recursos |
| `src/data/contact.ts` | Email, WhatsApp e Instagram de contacto |
| `src/lib/coach-prompt.ts` | Personalidad y límites de la coach |
| `src/app/globals.css` | Colores de marca (modo claro y oscuro) |

## Coach virtual

El chat llama a `/api/coach`, que usa la API de Anthropic desde el servidor.

- Creá una clave en https://platform.claude.com y cargala en Vercel como `ANTHROPIC_API_KEY`. Nunca la subas al repositorio.
- Sin la clave, la app funciona igual y el chat avisa que la coach todavía no está activa.
- Cada mensaje tiene costo. Hay un tope de 20 mensajes por día por alumna (`NEXT_PUBLIC_COACH_DAILY_LIMIT`) y un tope básico por IP en el servidor. Conviene además fijar un límite de gasto mensual en la consola de Anthropic.
- El modelo se cambia con `COACH_MODEL`.

## Limitaciones actuales

- **No hay cuentas ni control de acceso.** Cualquiera que tenga la dirección puede entrar. Para que solo entren quienes compraron hace falta sumar inicio de sesión y enlazarlo con la compra.
- **El progreso se guarda en el dispositivo** (almacenamiento del navegador). No se sincroniza entre celulares y se pierde si se borran los datos del navegador.
- **El repositorio es público**, así que los enlaces de los videos que cargues en `videos.ts` quedan a la vista de quien lea el código.

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
