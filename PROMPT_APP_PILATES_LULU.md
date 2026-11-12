# Prompt para construir la app "Pilates Lulú"

> Copiá todo lo que está debajo de la línea y pegalo en tu constructor (Lovable, Bolt, v0, Claude Code, etc.).
> Los datos entre `[CORCHETES]` son los que tenés que completar antes de pegarlo.

---

## ROL Y OBJETIVO

Sos un equipo senior de producto, diseño y desarrollo full‑stack. Construí **Pilates Lulú**, una web app instalable (PWA), mobile‑first y en español rioplatense (voseo), para mujeres que quieren hacer pilates en casa. La app acompaña un **reto de 28 días** con clase diaria en video, **plan alimenticio** con recetas, **recursos digitales** (guías/ebooks), seguimiento de progreso y una **coach virtual con IA** que responde dudas las 24 hs.

La usuaria típica tiene entre 35 y 65 años y poca experiencia con tecnología: todo debe ser obvio, con textos grandes, botones grandes y cero jerga técnica.

Todo el contenido (textos, clases, recetas, tips, imágenes) debe ser **original de Pilates Lulú**. Cargá contenido de ejemplo original y realista para que la app se vea completa, dejando todo editable desde el panel de administración.

## STACK

- React + TypeScript + Vite, Tailwind CSS, shadcn/ui, lucide-react, React Router, TanStack Query.
- Supabase: Auth, Postgres con Row Level Security, Storage y Edge Functions.
- IA de la coach: Edge Function que llama a la API de Anthropic (modelo `claude-sonnet-5-5`), con streaming. La API key vive solo en el servidor.
- Pagos: Mercado Pago (Checkout Pro) con webhook que habilita las compras. Moneda ARS.
- Videos: reproductor embebido (YouTube no listado o Vimeo/Bunny) cuyo ID se carga desde el admin.
- PWA: manifest, service worker, íconos, pantalla "Instalar la app" con paso a paso para iPhone y Android.

## IDENTIDAD VISUAL

- Marca: **Pilates Lulú**. Logo: `[SUBIR LOGO]`. Si no hay, crear un isotipo simple y original con las iniciales.
- Paleta sugerida (ajustable): fondo crema cálido `#FBF7F2`, superficie `#FFFFFF`, primario `[COLOR PRIMARIO, ej. terracota #C8553D]`, secundario salvia `#8FA998`, texto `#2B2B2B`.
- Tipografía: serif elegante para títulos (ej. Fraunces) y sans muy legible para texto (ej. Nunito). Tamaño base 17–18 px.
- Tarjetas con bordes muy redondeados, sombras suaves, mucho aire. Modo claro y oscuro con interruptor en el encabezado.
- Tono: cálido, cercano, motivador, nunca culposo. Ejemplo de estilo: "No tenés que hacerlo perfecto, solo tenés que empezar".
- Accesibilidad: contraste AA, áreas táctiles de 48 px o más, foco visible, respetar `prefers-reduced-motion`.

## NAVEGACIÓN

Barra inferior fija con 5 pestañas: **Inicio · Programa · Progreso · Recetas · Más**.
Encabezado con logo, carrito, modo oscuro y salir.
Botón flotante permanente de la coach (burbuja de chat) visible en todas las pantallas.
"Más" abre una hoja inferior con: Coach Lulú, Recursos, Mi perfil, Ayuda y contacto, Instalar la app.
Página 404 amable con botón "Ir al inicio".

## PANTALLAS

### 1. Ingreso (`/auth`)
- Un solo formulario con email y contraseña (mínimo 6 caracteres, botón de ojo para ver lo escrito). Si el email no existe, la cuenta se crea automáticamente al tocar "Entrar".
- "¿Olvidaste tu contraseña?" con recuperación por email.
- Acordeón "¿Cómo empezar?" con 3 pasos ilustrados.
- **Mejora:** ingreso con Google y con enlace mágico por email, y mensajes de error claros en lenguaje simple.

### 2. Onboarding (primera vez) — mejora
Cuatro pasos cortos: nombre, objetivo (tonificar, movilidad, bajar estrés, aliviar espalda), nivel (nunca hice / algo / habitual), y condiciones a tener en cuenta (espalda, rodillas, suelo pélvico, embarazo/posparto, ninguna) más preferencias de alimentación (sin restricciones, vegetariana, vegana, sin gluten). Elegir horario de recordatorio diario. Estos datos personalizan el plan de comidas y las respuestas de la coach.

### 3. Inicio (`/`)
En este orden:
1. Saludo con nombre y frase del día.
2. Banner de novedades descartable (ej. un plan nuevo).
3. "¿Cómo usar la app?" en 4 pasos (se oculta tras la primera semana).
4. **Tu clase de hoy · Día N**: miniatura, título, categoría, duración, botones "Comenzar sesión" y "Marcar día como hecho".
5. **Tip del día** (lectura de 1 minuto) que abre en modal.
6. **Tu plan de comidas de hoy**: selector de tipo de día (Normal / Con gustito / Descanso) y tarjetas de desayuno, almuerzo, merienda y cena que enlazan a la receta. Botón "Cambiar" para reemplazar una comida por otra equivalente.
7. Resumen: días completados sobre 28, racha y porcentaje de avance.
8. Mini calendario del mes con los días cumplidos y botón "Ir a hoy".
9. Guía de bienvenida incluida (PDF o lector interno).
10. Carrusel de recursos destacados con precio y precio tachado.
11. Carrusel de testimonios y botón "Dejá tu testimonio".
12. Enlace a preguntas frecuentes.

### 4. Programa (`/programa`)
- Selector de plan (la app admite varios planes de 28 días; arrancar con 2: `[NOMBRE PLAN 1]` y `[NOMBRE PLAN 2]`).
- Anillo de progreso "N de 28", semana actual y botón "Continuar con el día N".
- Pestañas Semana 1 a 4; cada semana lista 7 clases con estado (hoy, mañana, completada, bloqueada), título, categoría (Fundamentos, Fuerza, Movilidad, Flexibilidad, Equilibrio, Terapéutico, Revisión) y duración (10 a 25 min).
- Cada día se desbloquea al completar el anterior.
- Sección "Sobre el método".
- **Pantalla de clase:** video, descripción, qué vas a trabajar, material necesario, variantes fáciles para quien tiene molestias, botón "Marcar como completado" con celebración (confeti suave), y luego una mini encuesta: cómo te sentiste (3 opciones) y nota opcional.
- **Mejoras:** guardar el punto donde quedó el video, botón "Preguntarle a la coach sobre esta clase", opción "Hoy tengo solo 10 minutos" que ofrece una versión corta, y posibilidad de repetir clases ya hechas.

### 5. Progreso (`/progreso`)
- Racha de práctica con **1 día libre por semana** que no corta la racha.
- Tiempo total entrenado y días completados.
- Registro diario de energía (Con energía / Normal / Cansada) y gráfico de los últimos 14 días.
- Calendario semanal y mensual con leyenda (clase hecha, día libre).
- Logros compartibles en los días 7, 14 y 28: genera una imagen con la marca para compartir en WhatsApp o Instagram.
- Registro de peso (kg o lb) con fecha, historial y gráfico. Opcional y sin mensajes de juicio.
- **Mejoras:** medidas corporales opcionales, fotos de antes/después guardadas en privado, y certificado descargable al completar los 28 días.

### 6. Recetas y plan alimenticio (`/recetas`)
- Listado con buscador y filtros por momento del día (Desayuno, Almuerzo, Merienda, Cena) y tipo (Antiinflamatorio, Proteico, Vegetariano, Vegano, Sin gluten, Postre, Detox).
- Tarjeta: foto, nombre, tiempo y etiqueta. Detalle: ingredientes, pasos numerados, porciones y tip.
- Cargar al menos 40 recetas originales, simples, con ingredientes fáciles de conseguir en Argentina.
- **Plan de 28 días:** menú diario asignado, adaptado a las preferencias del onboarding.
- **Mejoras:** favoritos, lista de compras semanal generada automáticamente (con casillas para tildar y botón para compartir por WhatsApp), e información nutricional aproximada.
- Aviso visible: el plan es orientativo y no reemplaza a un profesional de la nutrición.

### 7. Recursos (`/recursos`)
- Tienda de guías digitales: tarjeta con tipo (Ebook, Combo, Programa), título, descripción, precio y precio anterior, insignia de ahorro en combos.
- Carrito, checkout con Mercado Pago, y tras el pago el recurso queda en "Mi biblioteca" con descarga inmediata (enlace firmado de Supabase Storage).
- Recursos gratuitos incluidos (Guía de bienvenida).
- Productos iniciales: `[LISTAR EBOOKS/GUÍAS DE LULÚ CON PRECIO]`.

### 8. Coach virtual "Lulú" (`/coach`)
- Chat con mensaje de bienvenida, sugerencias rápidas (No sé qué comer · No tengo ganas hoy · Me duele la espalda · Rutina de 15 min · ¿Cómo sigo si falté?), campo de texto, respuestas en streaming e historial guardado.
- Plan gratuito con `[N]` mensajes por día y contador visible; plan Pro con mensajes ilimitados.
- La coach recibe como contexto: nombre, objetivo, nivel, condiciones, día actual del programa, racha, últimas energías registradas y preferencias de alimentación.
- La coach responde usando una **base de conocimiento** editable desde el admin (programa, clases, recetas, preguntas frecuentes, políticas de pago y acceso). Puede enlazar a pantallas de la app (una clase, una receta, un recurso).
- Si no sabe o es un tema de pagos/acceso que no puede resolver, ofrece derivar a una persona por WhatsApp `[NÚMERO]` o email `[EMAIL]`.

**Instrucciones de sistema de la coach (usalas tal cual en la Edge Function):**

```
Sos Lulú, la coach virtual de Pilates Lulú. Acompañás a mujeres que hacen un reto de pilates de 28 días en casa.
Hablás en español rioplatense, con voseo, de forma cálida, breve y concreta. Respondés en 2 a 5 oraciones salvo que te pidan más detalle.
Ayudás con: dudas sobre ejercicios y técnica, cómo adaptar una clase, motivación y constancia, ideas de comidas y recetas del plan, hábitos de descanso e hidratación, y uso de la app.
Usá los datos de la alumna y la base de conocimiento que recibís. Si la respuesta no está ahí, decilo con honestidad y no inventes.
No diagnosticás ni indicás tratamientos o medicación. Ante dolor agudo, mareos, embarazo, cirugías recientes o condiciones médicas, sugerí frenar y consultar a su médica o médico, y ofrecé una alternativa suave solo si es seguro.
No prometés resultados de peso ni das dietas restrictivas. Nunca usás lenguaje de culpa sobre el cuerpo o la comida.
Si detectás señales de un trastorno alimentario o de malestar emocional serio, respondé con cuidado y recomendá buscar ayuda profesional.
Para problemas de pago o acceso que no puedas resolver, derivá a soporte humano.
```

### 9. Ayuda (`/ayuda`)
- Preguntas frecuentes en acordeón por categoría: Acceso, La app, Pagos, El programa.
- Contacto por email y WhatsApp, enlaces a Instagram y Facebook.
- Formulario de sugerencias (Mejora / Idea / Otro, hasta 1000 caracteres).
- Invitación a dejar reseña.

### 10. Perfil (`/perfil`) — mejora
Datos, objetivo, preferencias, recordatorios, mis compras, plan actual, reiniciar el programa, cerrar sesión y eliminar cuenta.

### 11. Panel de administración (`/admin`, solo rol admin) — mejora clave
ABM de: planes, días y clases (título, video, duración, categoría, descripción), recetas y menú de 28 días, tips diarios, recursos y precios, preguntas frecuentes, banners de novedades, testimonios (con moderación antes de publicar), base de conocimiento de la coach. Además: listado de alumnas con su avance, ventas, sugerencias recibidas y métricas (activas, tasa de finalización por día, clases más abandonadas, preguntas más frecuentes a la coach).

## MODELO DE DATOS (Supabase)

`profiles`, `plans`, `plan_days`, `user_plan_progress`, `day_completions`, `energy_logs`, `weight_logs`, `recipes`, `meal_plan_days`, `favorite_recipes`, `shopping_list_items`, `daily_tips`, `resources`, `orders`, `order_items`, `user_resources`, `testimonials`, `faqs`, `suggestions`, `announcements`, `coach_conversations`, `coach_messages`, `coach_knowledge`, `subscriptions`, `user_roles`.

RLS en todas las tablas: cada usuaria solo lee y escribe lo suyo; el contenido publicado es de solo lectura; solo admin edita contenido. El límite de mensajes de la coach y la entrega de recursos pagos se validan siempre en el servidor.

## REGLAS DE NEGOCIO

- El "día de hoy" del programa es el siguiente al último completado, no depende de la fecha de alta.
- Completar un día suma minutos, actualiza racha y desbloquea el siguiente.
- Racha: se mantiene si falta como máximo 1 día por semana.
- Terminar el día 28 muestra pantalla de celebración, certificado y propuesta de siguiente plan.
- El material no se borra al pasar los 28 días.
- Pago único por recurso; el plan Pro de la coach es `[PAGO ÚNICO / SUSCRIPCIÓN MENSUAL]` a `[PRECIO]`.

## NOTIFICACIONES — mejora

Recordatorio diario a la hora elegida (push web y email), aviso si lleva 2 días sin entrar con mensaje amable, y felicitación en los días 7, 14 y 28.

## CALIDAD

- Lighthouse móvil ≥ 90 en rendimiento y accesibilidad. Carga diferida de imágenes y rutas.
- Estados de carga (skeletons), vacío y error en todas las pantallas.
- SEO básico y metadatos para compartir.
- Textos legales: términos, privacidad y aviso de salud (consultar al médico antes de empezar actividad física).
- Datos de ejemplo cargados y una usuaria admin de prueba.

## ORDEN DE CONSTRUCCIÓN

1. Diseño base, navegación y autenticación.
2. Programa de 28 días, pantalla de clase y progreso.
3. Recetas y plan alimenticio.
4. Coach con IA.
5. Recursos, carrito y pagos.
6. Panel de administración.
7. PWA, notificaciones y pulido.

Al terminar cada etapa mostrame el resultado y esperá mi confirmación antes de seguir.

## DATOS QUE COMPLETO YO

- Logo y colores: `[ ]`
- Nombres de los planes y lista de 28 clases con enlace de video: `[ ]`
- Ebooks/guías y precios: `[ ]`
- Email, WhatsApp, Instagram y Facebook: `[ ]`
- Mensajes gratis por día de la coach y precio del plan Pro: `[ ]`
