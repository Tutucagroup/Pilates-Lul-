# Pilates Lulú · Funnel quiz + página de venta

Funnel tipo cuestionario para el **Reto de 28 días de Pilates Asiático** (mujeres de 40 a 70 años, Argentina).
5 preguntas → resultado personalizado con la venta en la misma pantalla → checkout de **Impultienda**.

Preguntas: kilos a bajar · dónde siente molestias · edad · cómo describe su cuerpo · zonas a trabajar (varias). En la pantalla final el precio con los 2 programas incluidos y el botón **"Ver mi plan"** (directo al checkout) están arriba de todo; debajo, la explicación del resultado y el resto de la venta (beneficios, qué incluye, testimonios, FAQ, segundo botón, garantía). `/q/oferta` redirige a `/q/resultado` para no romper links viejos.

**En vivo:** https://pilates-lul.vercel.app

**Landing de venta directa (para probar contra el quiz):** `/landing` (`src/app/landing/page.tsx`). Botón directo al checkout con las UTM de la visita. Los clics de compra quedan en Supabase con `stepId: "landing"`. Imágenes en `public/images/landing/`; las capturas de la app son pantallas reales de app-alumnas. Para separar las ventas de cada página, usá un `utm_content` distinto en cada anuncio (por ejemplo `quiz` y `landing`).

Next.js 15 (App Router) · TypeScript · Tailwind 4 · Zustand · Supabase · Meta Pixel + Conversions API · Vercel.

> La **app de alumnas** (el producto que se entrega tras la compra) es un proyecto aparte: está en [`app-alumnas/`](app-alumnas/README.md) y se publica como otro proyecto de Vercel.

---

## Arranque rápido

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Abrí http://localhost:3000. Sin variables de entorno el funnel funciona igual: el tracking y Supabase quedan apagados (no-op).

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build && npm start` | Build de producción local |
| `npm test` | Tests de las reglas (vitest) |
| `npm run typecheck` / `npm run lint` | Tipos y lint |
| `npm run testimonials:sync` | Publica reseñas aprobadas de Supabase en `data/testimonials.json` |
| `npm run images:optimize` | Recomprime `public/images` y genera `og.webp` |

---

## Dónde está cada cosa

```
src/config/brand.config.ts    ← ÚNICA fuente de verdad: marca, precios, garantía, checkout, Pixel, urgencia
src/config/funnel.config.ts   ← pasos, textos, opciones, imágenes, reglas, A/B y contenido de la oferta
src/funnel/                   ← tipos, motor del funnel (funciones puras) y store Zustand
src/lib/rules/                ← personalización: IMC, ritmo, nivel, orden de beneficios, resumen (+ tests)
src/lib/pricing.ts            ← descuento y cuotas calculados desde brand.config
src/lib/checkout.ts           ← arma el link al checkout de Impultienda
src/lib/tracking/             ← Pixel + CAPI + eventos a Supabase
src/components/steps/         ← los componentes de paso: single, multi, info, ruler, loader, result
src/components/offer/         ← página de venta (offer), precio, botón, testimonios, reseñas, FAQ, urgencia
src/app/                      ← rutas: "/" (paso 1), "/q/[paso]", "/opinion", "/api/*"
data/testimonials.json        ← testimonios y reseñas REALES (vacío = las secciones no se muestran)
supabase/migrations/          ← SQL de tablas, vistas y bucket
creatives/                    ← 5 guiones de video + 5 textos de anuncio
research/                     ← investigación privada (en .gitignore: no se sube a GitHub ni a Vercel)
public/images/BRIEFS.md       ← brief de cada imagen
```

---

## Cómo editar precios

Todo en `src/config/brand.config.ts`:

```ts
pricing: { currency: "ARS", listPrice: 45000, offerPrice: 14900, installments: 3 },
guarantee: { days: 7 },
program: { name: "Reto de 28 días", days: 28, minutesPerDay: 15 },
```

- El **% OFF** se calcula solo (`56%`) y las **cuotas** también (`3 × $6.633`). Ningún componente tiene precios escritos a mano.
- `installments: 0` oculta las cuotas.
- Si cambiás el precio acá, **cambialo también en Impultienda** (precio y precio tachado).
- Los colores de marca están en `brand.config.ts` y espejados en `src/app/globals.css` (`@theme`). Si cambiás uno, cambiá el otro.

### Urgencia (apagada por defecto)
Solo si es real:

```ts
urgency: {
  countdown: { endsAt: "2026-12-01T03:00:00Z" }, // fecha real de fin de la oferta; al vencer, desaparece
  stock: { remaining: 20, label: "cupos con acompañamiento" }, // cupos reales; actualizalo vos
},
```

Con `null` no se muestra nada. La cuenta regresiva no se reinicia por visitante.

---

## Cómo editar los pasos

Todo en `src/config/funnel.config.ts`. Cada paso es un objeto con `id`, `name` (para analytics) y `type`:

| type | Qué es | Campos principales |
|---|---|---|
| `single` | Opción única, avanza sola al tocar | `title`, `subtitle`, `label`, `layout: "list" \| "emoji" \| "image"`, `options`, `image`, `notes` |
| `multi` | Selección múltiple; "Continuar" deshabilitado hasta elegir | `layout: "list" \| "image"`, `options` (con `exclusive: true` para "Ninguna"), `cta` |
| `info` | Refuerzo | `title`, `text`, `image`, `cta` |
| `ruler` | Regla arrastrable cm/in o kg/lb | `measure: "height" \| "weight"`, `min`, `max`, `initial` (en métrico), `note`, `check` |
| `loader` | Progreso animado que avanza solo | `title`, `messages`, `durationMs` |
| `result` | Pantalla final: precio + botón al checkout arriba, explicación del resultado y venta abajo | `title`, `cta` (botón de arriba) |

`info` y `ruler` no se usan en el quiz corto, pero siguen disponibles. Si volvés a sumar altura y peso (`altura`, `peso`, `peso-objetivo`), el resultado vuelve a mostrar el IMC y el ritmo estimado.

- **Reordenar:** mové el objeto dentro de `steps`. La barra de progreso se recalcula sola.
- **Agregar/quitar opciones:** editá `options`. Los `id` se guardan en Supabase y los usan las reglas: si cambiás un `id`, buscalo en `src/lib/rules/`.
- **Saltear un paso según una respuesta:** `showIf: { stepId: "molestias", anyOf: ["rodillas"] }`.
- **Línea de aviso** (pasos `single`): `notes: [{ when: { stepId: "molestias", anyOf: ["rodillas"] }, text: "..." }]`. Si se dispara un aviso, el paso no avanza solo: muestra el aviso y un botón "Continuar".
- **Valor inicial derivado:** `initial: { fromStep: "peso", offset: -5, fallback: 65 }`.
- **Imágenes:** ruta dentro de `public/`, p. ej. `"/images/hero.webp"`.
- **Textos:** siempre voseo. Hay un test que falla si aparece "tú", "tienes", "quieres", etc.
- Si cambiás mucho el funnel, cambiá `storageKey` para que no se mezclen sesiones guardadas viejas.

### Tests A/B por paso

```ts
{
  id: "edad",
  // ...
  variants: {
    B: { weight: 50, override: { subtitle: "Respondé 1 minuto y te mostramos tu plan" } },
  },
  controlWeight: 50, // peso de la variante A (opcional, 50 por defecto)
}
```

- La asignación es determinística por sesión + paso (siempre ve la misma variante).
- La variante viaja en cada evento (`quiz_step`, Supabase) (se guarda en Supabase con cada sesión).
- Resultados: vista `ab_results` en Supabase (sesiones, llegaron al resultado, tocaron comprar).
- Un paso con test se oculta hasta rehidratar para no parpadear: evitá testear el paso 1 si te importa el LCP.

### Contenido de la oferta
En `funnel.offer`: titular y subtítulo (funciones que reciben el resultado), cómo funciona, qué incluye, beneficios (con `tags` para ordenarlos), bonos, FAQ, textos de los botones y garantía.
⚠️ **"Qué incluye" y los bonos tienen que coincidir con lo que entregás.** Si no tenés bonos, dejá `bonuses: []` y la sección desaparece.

---

## Reglas de personalización

Funciones puras en `src/lib/rules/`, con tests en `src/lib/__tests__/`:

| Archivo | Regla |
|---|---|
| `bmi.ts` | IMC con 1 decimal y rango de referencia de la OMS, con textos neutros ("Dentro del rango de referencia"), sin diagnósticos. |
| `pace.ts` | Ritmo hacia el peso objetivo entre **0,5 y 1 kg por semana**. Si el objetivo deja el IMC < 18,5 → **no promete fecha** (`unhealthy-target`). Si el objetivo es mantener o subir → sin proyección. |
| `level.ts` | Nivel **suave / intermedio** según molestias, edad y cuerpo. Puntos: cualquier molestia 2, edad 60-64 1 · 65+ 2, sobrepeso 1. Puntaje ≥ 2 → suave. Sin datos → suave. |
| `benefits.ts` | Ordena los beneficios de la oferta: zonas ×3, cuerpo ×2, molestias ×2, el resto ×1. |
| `summary.ts` | Arma el resumen (objetivo en kilos, zonas, zona que cuidamos, nivel, IMC y ritmo si hay altura y peso, beneficios ordenados). |

Para cambiar umbrales, editá las constantes al principio de cada archivo y corré `npm test`.

---

## Testimonios y reseñas (solo reales)

`TestimonialCarousel` (los que tienen foto o video) y `ReviewList` (todos, con estrellas y promedio real) leen `data/testimonials.json`. Solo se muestran entradas con `"consentimiento": true`. **Si el archivo está vacío (`[]`), las secciones no aparecen.** No hay reseñas, contadores ni fotos de relleno.

Formato:

```json
[{ "id": "uuid", "nombre": "Marta", "ciudad": "Rosario", "texto": "...", "estrellas": 5,
   "foto": "/testimonials/uuid.jpg", "video": null, "fecha": "2026-11-20", "consentimiento": true }]
```

### Flujo `/opinion` → publicación
1. La alumna entra a **`/opinion`**, deja nombre, ciudad, estrellas, texto, y (opcional) foto o video, y **acepta el uso de su imagen** (obligatorio).
2. El archivo se sube directo a Supabase Storage (bucket **privado** `review-media`, carpeta `pending/`) y la reseña queda con `status = 'pending'`.
3. Vos la revisás en Supabase → Table Editor → `reviews` y cambiás `status` a `approved` (o `rejected`).
4. Corrés `npm run testimonials:sync`: baja las aprobadas, copia sus fotos/videos a `public/testimonials/` y escribe `data/testimonials.json`.
5. Commit + deploy. Recién ahí se publica.

Mandale el link `https://tu-dominio/opinion` a las alumnas por email cuando terminen el reto.

---

## Supabase

1. Creá un proyecto en https://supabase.com.
2. SQL Editor → pegá y ejecutá `supabase/migrations/0001_init.sql` (crea tablas, función, vistas, RLS y el bucket privado).
3. Project Settings → API → copiá `URL`, `anon key` y `service_role key` a `.env.local` y a Vercel.

Qué se guarda:
- `quiz_sessions`: una fila por sesión con respuestas, UTM/fbclid, variantes A/B, último paso, si llegó al resultado y si tocó comprar.
- `quiz_events`: cada vista, respuesta, resultado y click de compra, por paso y variante.
- Vista **`funnel_dropoff`**: abandono por paso (y por variante).
- Vista **`ab_results`**: rendimiento de cada variante.

Todas las tablas tienen RLS sin políticas públicas: solo el backend (service role) lee y escribe.

---

## Checkout Impultienda

Tienda: **Pilates Lulú** · https://pilates-lulu.impultienda.ar (tienda clásica "solo HTML").

El botón de compra del quiz lleva al checkout de la tienda con las UTM y el `fbclid` de la visita:

```
https://pilates-lulu.impultienda.ar/checkout?utm_source=…&utm_campaign=…&fbclid=…
```

El link se cambia en `brand.config.ts → impultienda.checkoutUrl`.

### 1 · Landing de la tienda
La landing de la tienda es una página corta con el botón **"Hacer el test gratis"**, que lleva al quiz (https://pilates-lul.vercel.app). Los anuncios conviene que apunten directo al quiz.

### 2 · Producto y entrega
- Producto principal: "Pilates Lulú". Su entregable es un **link externo**: https://app-alumnas.vercel.app.
- Impultienda manda solo el mail de entrega con el botón a ese link apenas se aprueba el pago. El texto de ese mail **no se edita**: lo arma la plataforma con el logo, el nombre y el color de la tienda.
- El mail de bienvenida con las instrucciones está en [`entrega/mail-confirmacion-compra.md`](entrega/mail-confirmacion-compra.md).
- Precio y precio tachado del producto en Impultienda tienen que coincidir con `brand.config.ts → pricing`.

### 3 · Webhook de ventas
Impultienda manda su mail de entrega fijo (con el link de cada producto). Además, cada venta aprobada le avisa al funnel:

1. Impultienda → Configuraciones → **Webhooks** → **Agregar endpoint**: URL `https://pilates-lul.vercel.app/api/impultienda/webhook`, tienda **Pilates Lulú**, evento **Pago confirmado**. Copiá la **clave de firma**.
2. En Vercel → Settings → Environment Variables (Production): `IMPULTIENDA_WEBHOOK_SECRET` con esa clave. Después, **Redeploy**.

Qué hace con cada venta:
- **Anota qué planes compró la alumna** (el reto y Rejuvenecé) en Vercel Blob (almacenamiento privado `pilates-lulu-accesos`, ver `src/lib/entitlements.ts`). Hoy la app no lo pide para entrar; queda como registro.
- **Mail de bienvenida propio (opcional):** solo sale si cargás un proveedor de mails (`RESEND_API_KEY` y `MAIL_FROM`). Sin eso, el webhook responde 200 y la alumna recibe solo el mail de entrega de Impultienda. El texto está en `src/lib/impultienda/welcome-email.ts` (fuente: `entrega/mail-confirmacion-compra.md`).
- Si falla el envío del mail, responde 502 e Impultienda reintenta durante ~32 h.

### 4 · Los 2 programas en un solo producto ($14.900)
El reto de 28 días y "Rejuvenecé y Adelgazá después de los 50" **no se venden por separado**: los dos vienen en el producto principal de $14.900.

- **Quiz:** junto al precio, la tarjeta "Incluye los 2 programas" (`brand.config.ts → includedProgram`). También están en "Qué incluye" y en la FAQ. No hay order bump.
- **Checkout (Impultienda):** el principal «Pilates Asiático - Reto 28 días» ($14.900) lleva como **bono** «Rejuvenecé y Adelgazá después de los 50» (`c1d30ae5-2f71-4cce-85e9-c7cd97abb27d`, entregable: link a la app). El checkout lo muestra como incluido debajo del principal y llega en el mismo mail de entrega. La etiqueta del resumen se elige en Diseño de checkout → «Anuncio de bonos en el resumen».
- El upsell viejo de $5.900 (`50ea7b14-43ec-4901-b615-f81b4da73143`) quedó con **«Solo post-compra»** y sin funnel post-compra, así que no se ofrece en ningún lado. En una tienda clásica los ebooks no se desactivan desde el conector: si querés sacarlo del todo, borralo desde Diseño de ebooks.
- **Webhook y mail:** cada compra del reto anota los 2 planes y el mail de bienvenida menciona los dos.
- **App de alumnas:** los 2 planes están abiertos para todas en Programa (ver `app-alumnas/README.md`).

### 5 · Compra de prueba
Hacé una compra de prueba y verificá que llegue el mail de entrega, que su botón abra la app y que la venta tenga las `utm_*`.

### 6 · Cuotas
"3 cuotas sin interés" depende de tu medio de pago (p. ej. Mercado Pago con cuotas sin interés activadas). Confirmalo en tu pasarela; si no aplica, poné `installments: 0`.

---

## Tracking: Meta Pixel + Conversions API

| Evento | Cuándo | Dónde |
|---|---|---|
| `PageView` | Cada cambio de ruta | Funnel (Pixel + CAPI) |
| `quiz_step` (custom) | Cada paso visto: `step_number`, `step_name`, `step_id`, `variant` | Funnel (Pixel + CAPI) |
| `Lead` | Una vez por sesión, al llegar al resultado | Funnel (Pixel + CAPI) |
| `InitiateCheckout` | Al tocar "Quiero empezar mi reto" (`value`, `currency`, `content_ids`) | Funnel (Pixel + CAPI) |
| `Purchase` | Pago confirmado | **Impultienda** (pixel de la tienda) |

- Cada evento del funnel se manda por Pixel **y** CAPI con el **mismo `event_id`**: Meta los deduplica.
- CAPI envía IP, user agent, `_fbp`, `_fbc` (o lo arma desde `fbclid`) y `external_id` (hash SHA-256 del ID de sesión).
- El Pixel se carga después de pintar la página (no afecta el LCP).

### Configuración
1. Events Manager → tu dataset (Pixel) → copiá el **ID** a `brand.config.ts → meta.pixelId`.
2. Configuración → **Conversions API → Generar token de acceso** → `META_CAPI_ACCESS_TOKEN` en Vercel.
3. Para probar: Events Manager → "Probar eventos" → copiá el código a `META_TEST_EVENT_CODE`. Borralo en producción.
4. Verificá tu dominio en Business Manager → Configuración del negocio → Seguridad de la marca → Dominios.

### Pixel en Impultienda (Purchase)
1. En Impultienda → Configuraciones → **Meta / Tracking**, cargá **el mismo ID de Pixel** que usa el funnel y su token de Conversions API.
2. La tienda inserta el pixel sola en la landing, el checkout y las páginas posteriores a la compra. **No** pegues el código del pixel en el HTML de la landing: duplicaría eventos.

### Evitar duplicados de InitiateCheckout
Si el checkout de Impultienda también manda `InitiateCheckout`, puede contarse dos veces. Opciones:
- Dejar `meta.sendInitiateCheckout: true` y optimizar campañas por **Purchase**, no por InitiateCheckout.
- O poner `sendInitiateCheckout: false` y usar solo el de la tienda.

---

## Deploy en Vercel

1. Subí el repo a GitHub → Vercel → **New Project** → importalo (framework: Next.js, sin cambios).
2. Cargá las variables de `.env.example` en Settings → Environment Variables.
3. Deploy. Agregá tu dominio en Settings → Domains y actualizá `NEXT_PUBLIC_SITE_URL`.
4. `research/` y `creatives/` están en `.vercelignore`: no se suben.

## Performance (LCP < 2 s en 4G)

Medido con el build de producción en local, perfil "Slow 4G" de Lighthouse mobile (150 ms RTT, 1,6 Mbps, CPU ×4):

| Página | LCP | Elemento LCP |
|---|---|---|
| `/` (paso 1) | ~0,97 s local · ~0,9 s en Vercel | imagen hero |
| `/q/resultado` (antes `/q/oferta`) | ~1,2 s local · ~1,14 s en Vercel (medido antes del quiz corto) | titular |

Volvé a medir con PageSpeed Insights sobre tu dominio real después del deploy.

Qué lo hace rápido: todas las rutas se pre-renderizan como HTML estático; la imagen del paso 1 tiene `priority` + `fetchPriority="high"`; las imágenes van en WebP comprimido (7–62 KB) y Next las sirve en AVIF/WebP según el dispositivo; la fuente es self-hosted con `display: swap`; el Pixel se carga después del render y Supabase solo se carga en `/opinion`.

---

## Imágenes

Todas son originales, generadas con IA, y **solo ilustran**: nunca se presentan como alumnas ni como resultados (el pie de la oferta lo aclara). Brief de cada una (tamaño, encuadre, estilo) en `public/images/BRIEFS.md`. Para reemplazar una, mantené el nombre de archivo y el formato, y corré `npm run images:optimize`.

## Creativos e investigación

- `creatives/guiones-video.md`: 5 guiones de 30–45 s (gancho, desarrollo, cierre, con tiempos, VO y texto en pantalla).
- `creatives/textos-anuncios.md`: 5 textos con título, descripción y checklist de políticas de Meta.
- `research/swipe.md`: análisis **privado** de los anuncios de referencia. Solo para entender qué funciona: no se copia, no se publica y el lint bloquea cualquier import desde `research/`.

---

## Checklist antes de lanzar

- [ ] `brand.config.ts`: link del checkout de Impultienda, Pixel ID, email de soporte, `siteUrl`.
- [ ] Precio y precio tachado iguales en Impultienda y en `brand.config.ts`.
- [ ] "Qué incluye" y bonos coinciden con el producto real.
- [ ] Compra de prueba: llega el email de acceso, abre la app y la venta tiene las `utm_*`.
- [ ] Events Manager: PageView, quiz_step, Lead e InitiateCheckout aparecen como "Deduplicado" (navegador + servidor); Purchase llega desde Impultienda.
- [ ] Supabase: se crean filas en `quiz_sessions` / `quiz_events`.
- [ ] `/opinion` guarda una reseña de prueba como `pending`.
- [ ] `npm test` en verde.
