# Pilates Lulú · Funnel quiz + página de venta

Funnel tipo cuestionario para el **Reto de 28 días de Pilates Asiático** (mujeres de 40 a 70 años, Argentina).
19 pasos → resultado personalizado → página de venta → checkout de **Shopify**.

**En vivo:** https://pilates-lul.vercel.app

Next.js 15 (App Router) · TypeScript · Tailwind 4 · Zustand · Supabase · Meta Pixel + Conversions API · Vercel.

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
src/config/brand.config.ts    ← ÚNICA fuente de verdad: marca, precios, garantía, Shopify, Pixel, urgencia
src/config/funnel.config.ts   ← pasos, textos, opciones, imágenes, reglas, A/B y contenido de la oferta
src/funnel/                   ← tipos, motor del funnel (funciones puras) y store Zustand
src/lib/rules/                ← personalización: IMC, ritmo, nivel, orden de beneficios, resumen (+ tests)
src/lib/pricing.ts            ← descuento y cuotas calculados desde brand.config
src/lib/checkout.ts           ← arma el cart permalink de Shopify
src/lib/tracking/             ← Pixel + CAPI + eventos a Supabase
src/components/steps/         ← los 7 componentes de paso: single, multi, info, ruler, loader, result
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
pricing: { currency: "ARS", listPrice: 45000, offerPrice: 19900, installments: 3 },
guarantee: { days: 7 },
program: { name: "Reto de 28 días", days: 28, minutesPerDay: 15 },
```

- El **% OFF** se calcula solo (`56%`) y las **cuotas** también (`3 × $6.633`). Ningún componente tiene precios escritos a mano.
- `installments: 0` oculta las cuotas.
- Si cambiás el precio acá, **cambialo también en Shopify** (precio y precio de comparación).
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
| `result` | Resumen personalizado | `title`, `cta` |
| `offer` | Página de venta | (contenido en `funnel.offer`) |

- **Reordenar:** mové el objeto dentro de `steps`. La barra de progreso se recalcula sola.
- **Agregar/quitar opciones:** editá `options`. Los `id` se guardan en Supabase y los usan las reglas: si cambiás un `id`, buscalo en `src/lib/rules/`.
- **Saltear un paso según una respuesta:** `showIf: { stepId: "objetivo", anyOf: ["peso"] }`.
- **Línea de aviso** (pasos `single`): `notes: [{ when: { stepId: "sensacion", anyOf: ["molestias"] }, text: "..." }]`. Si se dispara un aviso, el paso no avanza solo: muestra el aviso y un botón "Continuar".
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
- La variante viaja en cada evento (`quiz_step`, Supabase) y al carrito de Shopify (`ab_variants`).
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
| `level.ts` | Nivel **suave / intermedio** según paso 9 (inactividad), 11 (sensación) y 16 (síntomas). Puntos: inactividad 0/1/2/2, sensación molestias 2 · cansancio 1 · bien 0, síntomas +1 c/u (dolor articular, suelo pélvico, cansancio; tope 2). Puntaje ≥ 2 → suave. Sin datos → suave. |
| `benefits.ts` | Ordena los beneficios de la oferta: objetivo ×3, zonas ×2, "qué querés lograr" ×2, el resto ×1. "Todo el cuerpo" activa todas las zonas. |
| `summary.ts` | Arma el resumen (objetivo, zonas, nivel, IMC, ritmo, beneficios ordenados). |

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

## Checkout Shopify

El botón de compra arma un **cart permalink**:

```
https://TIENDA.myshopify.com/cart/{variantId}:1
  ?attributes[quiz_session]=…&attributes[utm_source]=…&attributes[fbclid]=…
  &attributes[checkout_event_id]=…&attributes[quiz_level]=suave&attributes[ab_variants]=edad:B
  &utm_source=…&utm_campaign=…&fbclid=…
```

Los atributos quedan en el pedido (Pedido → "Detalles adicionales"), así podés cruzar cada venta con su sesión del quiz en Supabase.

### 1 · Producto digital
1. Shopify Admin → **Productos → Agregar producto**: "Reto de 28 días de Pilates Asiático".
2. **Precio:** `19900`. **Precio de comparación:** `45000`.
3. En **Envío**, desmarcá "Es un producto físico".
4. **Inventario:** sin seguimiento de stock (o "Continuar vendiendo sin stock").
5. Publicalo en el canal **Tienda online** (los cart permalinks lo necesitan).

### 2 · Entrega automática del acceso por email
Opción simple (gratis): instalá la app oficial **Digital Downloads** de Shopify → abrí el producto → "Más acciones → Digital Downloads" → subí un PDF con el link y las instrucciones de acceso (o el archivo del programa). Shopify manda el email de descarga automáticamente al confirmarse el pago.
Opción alternativa: en **Configuración → Notificaciones → Confirmación de pedido**, agregá un bloque Liquid que muestre el link de acceso cuando el pedido incluya este producto.
Hacé una compra de prueba (modo de prueba de Shopify Payments o pasarela "Bogus") y verificá que el email llegue.

### 3 · Variant ID y dominio
- Abrí `https://TIENDA.myshopify.com/products/<handle>.json` → `product.variants[0].id`. (O en el Admin: Producto → variante → el número al final de la URL.)
- Poné el dominio **.myshopify.com** y el ID en `brand.config.ts → shopify`. Mientras tengan los valores de ejemplo, el botón muestra un aviso en lugar de redirigir.

### 4 · Cuotas
"3 cuotas sin interés" depende de tu medio de pago (p. ej. Mercado Pago con cuotas sin interés activadas). Confirmalo en tu pasarela; si no aplica, poné `installments: 0`.

---

## Tracking: Meta Pixel + Conversions API

| Evento | Cuándo | Dónde |
|---|---|---|
| `PageView` | Cada cambio de ruta | Funnel (Pixel + CAPI) |
| `quiz_step` (custom) | Cada paso visto: `step_number`, `step_name`, `step_id`, `variant` | Funnel (Pixel + CAPI) |
| `Lead` | Una vez por sesión, al llegar al resultado | Funnel (Pixel + CAPI) |
| `InitiateCheckout` | Al tocar "Quiero empezar mi reto" (`value`, `currency`, `content_ids`) | Funnel (Pixel + CAPI) |
| `Purchase` | Pago confirmado | **Shopify** (app de Meta) |

- Cada evento del funnel se manda por Pixel **y** CAPI con el **mismo `event_id`**: Meta los deduplica.
- CAPI envía IP, user agent, `_fbp`, `_fbc` (o lo arma desde `fbclid`) y `external_id` (hash SHA-256 del ID de sesión).
- El Pixel se carga después de pintar la página (no afecta el LCP).

### Configuración
1. Events Manager → tu dataset (Pixel) → copiá el **ID** a `brand.config.ts → meta.pixelId`.
2. Configuración → **Conversions API → Generar token de acceso** → `META_CAPI_ACCESS_TOKEN` en Vercel.
3. Para probar: Events Manager → "Probar eventos" → copiá el código a `META_TEST_EVENT_CODE`. Borralo en producción.
4. Verificá tu dominio en Business Manager → Configuración del negocio → Seguridad de la marca → Dominios.

### App de Meta en Shopify (Purchase)
1. Shopify Admin → **Apps → Facebook & Instagram** (canal oficial de Meta) → instalar.
2. Conectá tu Business Manager, tu página y **el mismo dataset/Pixel** que usa el funnel.
3. En **Configuración de uso compartido de datos**, elegí **Máximo** (Pixel + Conversions API). Shopify manda `Purchase` por ambas vías y lo deduplica solo.
4. **No** agregues un Pixel manual en la página de gracias: duplicaría `Purchase`.

### Evitar duplicados de InitiateCheckout
El cart permalink lleva directo al checkout, y la app de Meta en Shopify **también** manda `InitiateCheckout` al abrirlo, con su propio `event_id`. Resultado: puede contarse dos veces. Opciones:
- Dejar `meta.sendInitiateCheckout: true` (pedido en el brief: el evento sale del funnel con la sesión y las UTM) y optimizar campañas por **Purchase**, no por InitiateCheckout.
- O poner `sendInitiateCheckout: false` y usar solo el de Shopify.

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
| `/q/no-estas-sola` | ~1,35 s local · ~1,27 s en Vercel | imagen |
| `/q/oferta` | ~1,2 s local · ~1,14 s en Vercel | titular |

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

- [ ] `brand.config.ts`: dominio Shopify, variant ID, Pixel ID, email de soporte, `siteUrl`.
- [ ] Precio y precio de comparación iguales en Shopify y en `brand.config.ts`.
- [ ] "Qué incluye" y bonos coinciden con el producto real.
- [ ] Compra de prueba: llega el email de acceso y el pedido tiene los atributos `quiz_session` y `utm_*`.
- [ ] Events Manager: PageView, quiz_step, Lead e InitiateCheckout aparecen como "Deduplicado" (navegador + servidor); Purchase llega desde Shopify.
- [ ] Supabase: se crean filas en `quiz_sessions` / `quiz_events`.
- [ ] `/opinion` guarda una reseña de prueba como `pending`.
- [ ] `npm test` en verde.
