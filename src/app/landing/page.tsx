import Image from "next/image";
import type { Metadata } from "next";
import { brand } from "@/config/brand.config";
import { funnel } from "@/config/funnel.config";
import { formatMoney, price } from "@/lib/pricing";
import { Logo } from "@/components/Logo";
import { ChatTestimonials } from "@/components/offer/ChatTestimonials";
import { Faq } from "@/components/offer/Faq";
import { ReviewList } from "@/components/offer/ReviewList";
import { TestimonialCarousel } from "@/components/offer/TestimonialCarousel";
import { LandingBuy, StickyBuy } from "@/components/landing/LandingBuy";

/**
 * Landing de venta directa (para probar contra el quiz). El botón va derecho al checkout de
 * Impultienda con las UTM de la visita; los clics quedan en Supabase con stepId "landing".
 * Precios, nombres y garantía salen de brand.config.ts.
 */

const { program: reto, includedProgram: rejuv, guarantee } = brand;
const totalClasses = reto.days + rejuv.classes;
const perClass = Math.ceil(price.offer / totalClasses);

export const metadata: Metadata = {
  title: `${brand.name} · ${reto.productName} + ${rejuv.name}`,
  description: `2 programas de ${brand.method} para mujeres +40, en tu casa y desde el celular: ${totalClasses} clases guiadas, plan de comidas, progreso y coach virtual. ${price.offerLabel} en un solo pago.`,
  alternates: { canonical: "/landing" },
  robots: { index: false, follow: false },
};

const Check = ({ className = "" }: { className?: string }) => (
  <span aria-hidden="true" className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-price text-[13px] font-bold text-white ${className}`}>
    ✓
  </span>
);

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-[13px] font-extrabold uppercase tracking-[0.14em] ${light ? "text-white/80" : "text-brand"}`}>{children}</p>
  );
}

function Section({
  children,
  tone = "light",
  className = "",
  id,
}: {
  children: React.ReactNode;
  tone?: "light" | "soft" | "dark";
  className?: string;
  id?: string;
}) {
  const bg = tone === "dark" ? "bg-brand-dark text-white" : tone === "soft" ? "bg-brand-soft" : "bg-bg";
  return (
    <section id={id} className={`${bg} px-4 py-14 md:py-20 ${className}`}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

function Phone({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mx-auto w-full max-w-[230px] rounded-[2.2rem] bg-ink p-2 shadow-xl shadow-black/20">
      <Image src={src} alt={alt} width={600} height={1200} sizes="230px" className="h-auto w-full rounded-[1.7rem]" />
    </div>
  );
}

const benefits = [
  { icon: "🌿", title: "Más movilidad y menos rigidez", text: "Movimientos lentos para espalda, caderas, rodillas y hombros. Te levantás, te agachás y caminás con más soltura." },
  { icon: "💪", title: "Fuerza y firmeza", text: "Piernas, glúteos, brazos y abdomen más firmes, con el peso de tu cuerpo y sin pesas." },
  { icon: "✨", title: "Abdomen y cintura", text: "Activación profunda del centro del cuerpo, que también ayuda a tu postura." },
  { icon: "⚖️", title: "Un hábito que ayuda a bajar de peso", text: "Moverte todos los días, junto con el plan de comidas de la app, es un buen aliado para desinflamarte y bajar de peso." },
  { icon: "⚡", title: "Más energía y mejor descanso", text: "Respiración y movimiento consciente para terminar el día menos cansada y dormir mejor." },
];

const appFeatures = [
  { src: "/images/landing/app-hoy.webp", title: "Tu clase de hoy", text: "Abrís la app y ya está la clase que toca, con su duración y lo que vas a trabajar. Un toque y empezás." },
  { src: "/images/landing/app-programa.webp", title: "Los 2 programas", text: "Elegís el plan que querés hacer y cambiás cuando quieras. El avance de cada uno se guarda por separado." },
  { src: "/images/landing/app-recetas.webp", title: "Plan de comidas", text: "Desayuno, almuerzo, merienda y cena para cada día, con 25 recetas simples. Se adapta si sos vegetariana, vegana o sin gluten." },
  { src: "/images/landing/app-progreso.webp", title: "Tu progreso", text: "Días hechos, racha, minutos acumulados, cómo te sentís y tu peso, para ver tu evolución semana a semana." },
];

const weeks = [
  { n: 1, name: "Empezar", text: "Tus primeras clases. Lo importante es aparecer cada día y conocer los movimientos." },
  { n: 2, name: "Sostener", text: "El cuerpo ya conoce la rutina: los ejercicios salen mejor y empezás a notar más soltura." },
  { n: 3, name: "Tonificar", text: "Clases con foco en piernas, brazos, abdomen y cardio. Sumás fuerza y energía." },
  { n: 4, name: "Completar", text: "Última semana. Cerrás tu reto y seguís con «" + rejuv.name + "» para no cortar el hábito." },
];

const stack = [
  { name: reto.productName, detail: `${reto.days} clases guiadas en video · una por día · fuerza, cardio y movilidad` },
  { name: rejuv.name, detail: `${rejuv.classes} clases más · ${rejuv.perWeek} por semana durante ${rejuv.weeks} semanas · para quemar grasa y tonificar` },
  { name: "Plan de comidas", detail: "4 comidas por día con 25 recetas simples, adaptadas a tu alimentación" },
  { name: "Coach Lulú, tu asistente virtual", detail: "Te responde dudas de las clases, de la comida y de cómo seguir, a cualquier hora" },
  { name: "Progreso y racha", detail: "Días hechos, minutos, cómo te sentís y tu peso, en una sola pantalla" },
  { name: "Tip del día y guía de bienvenida", detail: "Un consejo corto por día y una guía para arrancar bien" },
  { name: "App en tu celular", detail: "Se instala como una app más. También funciona en la tablet y la computadora" },
];

const forYou = [
  "Tenés más de 40 y querés volver a moverte sin dolor",
  "No te gustan los gimnasios ni los ejercicios de alto impacto",
  "Querés algo corto para hacer en tu casa, a tu ritmo",
  "Empezás desde cero o hace años que no hacés actividad",
  "Querés ordenar tu alimentación sin dietas imposibles",
];
const notForYou = [
  "Buscás un entrenamiento intenso de alto rendimiento",
  "Esperás resultados sin hacer las clases",
  "Tenés una lesión o condición médica y todavía no consultaste con tu médico",
];

const faq = [
  // La pregunta de tiempo por día del quiz se reemplaza por la de duración real de las clases.
  ...funnel.offer.faq.filter((f) => !f.q.startsWith("¿Cuánto tiempo")),
  {
    q: "¿Cuánto dura cada clase?",
    a: `Las clases del ${reto.productName} duran entre 8 y 29 minutos según el día. Las de «${rejuv.name}» duran alrededor de 15 minutos.`,
  },
  {
    q: "¿Es una suscripción?",
    a: "No. Es un pago único y los 2 programas quedan en tu app.",
  },
];

export default function Landing() {
  return (
    <div className="pb-24 md:pb-0">
      {/* Barra superior */}
      <div className="bg-brand-dark px-4 py-2 text-center text-[14px] font-bold text-white">
        2 programas en un solo pago · {price.offerLabel}
      </div>

      <header className="border-b border-black/5 bg-bg px-4">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-center md:justify-between">
          <Logo />
          <a href="#oferta" className="hidden text-[15px] font-bold text-brand md:block">
            Ver la oferta
          </a>
        </div>
      </header>

      {/* 1 · Hero */}
      <Section className="pt-10 md:pt-14">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <Eyebrow>{brand.method} · Mujeres +40</Eyebrow>
            <h1 className="mt-3 text-[34px] font-extrabold leading-[1.1] tracking-tight md:text-[46px]">
              Volvé a sentirte fuerte, liviana y sin dolores, con clases cortas en tu casa.
            </h1>
            <p className="mt-4 text-[18px] text-muted">
              {totalClasses} clases guiadas de {brand.method}, plan de comidas y seguimiento desde tu celular. Sin gimnasio, sin saltos y sin
              equipos.
            </p>
            <div className="mt-6 md:max-w-sm">
              <LandingBuy />
            </div>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-muted">
              <li>🔒 Pago seguro</li>
              <li>📩 Acceso inmediato</li>
              <li>🛡️ Garantía de {guarantee.days} días</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-xl shadow-brand/10">
            <Image
              src="/images/landing/lulu.webp"
              alt="Lulú mostrando la app de Pilates Lulú en una tablet"
              width={896}
              height={1120}
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, 480px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </Section>

      {/* 2 · Problema */}
      <Section tone="soft">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-extrabold leading-tight md:text-[36px]">
            No es que te falten ganas. Es que nadie te mostró un método pensado para tu cuerpo de hoy.
          </h2>
          <div className="mt-5 space-y-4 text-left text-[17px] text-ink/85">
            <p>
              Probaste el gimnasio y terminaste con las rodillas doloridas. Buscaste rutinas en internet y eran saltos, apuros y ejercicios
              pensados para alguien de 25.
            </p>
            <p>
              Después de los 40 el cuerpo cambia: se pierde fuerza, aparecen la rigidez y la panza, cuesta más descansar. Lo que necesita no es
              más esfuerzo. Necesita movimientos lentos, bien hechos y todos los días.
            </p>
          </div>
          <p className="mt-6 rounded-2xl bg-white px-5 py-4 text-[17px] font-bold ring-1 ring-black/5">
            Por eso armamos un reto corto, suave y progresivo, que arranca desde donde estás hoy.
          </p>
        </div>
      </Section>

      {/* 3 · Beneficios */}
      <Section>
        <div className="text-center">
          <Eyebrow>Lo que vas a sentir</Eyebrow>
          <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[36px]">Clase a clase, tu cuerpo responde</h2>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {benefits.map((b) => (
            <li key={b.title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-2xl">
                {b.icon}
              </span>
              <div>
                <p className="text-[18px] font-extrabold">{b.title}</p>
                <p className="mt-1 text-[15px] text-muted">{b.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4 · El método */}
      <Section tone="dark">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <Eyebrow light>El método</Eyebrow>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[38px]">
              El secreto no está en hacer más. Está en moverte lento, bien y todos los días.
            </h2>
            <p className="mt-4 text-[17px] text-white/85">
              El {brand.method} combina pilates con movimientos suaves y controlados y una respiración consciente. Trabaja la fuerza profunda sin
              castigar las articulaciones.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl">
            <Image
              src="/images/landing/en-casa.webp"
              alt="Mujer relajada sobre un mat en el living de su casa, con la clase en una tablet"
              width={1080}
              height={534}
              sizes="(max-width: 768px) 100vw, 480px"
              className="h-auto w-full"
            />
          </div>
        </div>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { t: "Lento y controlado", d: "Cada movimiento tiene una versión más suave. Vos marcás el ritmo." },
            { t: "Bajo impacto", d: "Sin saltos ni movimientos bruscos. Cuida rodillas, caderas y espalda." },
            { t: "Clases cortas", d: "Entre 8 y 29 minutos según el día. Entran en cualquier rutina." },
          ].map((c) => (
            <li key={c.t} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="text-[18px] font-extrabold">{c.t}</p>
              <p className="mt-1 text-[15px] text-white/80">{c.d}</p>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-sm">
          <LandingBuy note={false} />
        </div>
      </Section>

      {/* 5 · Quién está detrás */}
      <Section>
        <div className="grid items-center gap-8 md:grid-cols-[2fr_3fr] md:gap-12">
          <div className="mx-auto w-full max-w-xs overflow-hidden rounded-3xl md:max-w-none">
            <Image src="/images/landing/lulu.webp" alt="Lulú, de Pilates Lulú" width={896} height={1120} sizes="(max-width: 768px) 80vw, 380px" className="h-auto w-full" />
          </div>
          <div>
            <Eyebrow>Quién te acompaña</Eyebrow>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[36px]">Hola, soy Lulú 👋</h2>
            <div className="mt-4 space-y-4 text-[17px] text-ink/85">
              <p>
                Armé {brand.name} para las mujeres que quieren volver a moverse sin sufrir: sin gimnasios llenos, sin rutinas imposibles y sin
                sentirse mal por no poder seguir el ritmo.
              </p>
              <p>
                En la app tenés todo ordenado día por día: la clase, qué comer y cómo vas. Vos solo tenés que aparecer, y cuando tengas una duda,
                me preguntás.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 6 · Los 2 programas */}
      <Section tone="soft" id="programas">
        <div className="text-center">
          <Eyebrow>Tu compra incluye</Eyebrow>
          <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[38px]">Los 2 programas, en un solo pago</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              img: "/images/mockup.webp",
              w: 896,
              h: 1120,
              name: reto.productName,
              tag: `${reto.days} clases`,
              text: "Una clase por día durante 4 semanas, que suma un poco más cada semana. Combina fuerza, cardio suave y movilidad.",
              items: ["Clases de 8 a 29 minutos", "Piernas, glúteos, brazos, abdomen y todo el cuerpo", "Días de movilidad y flexibilidad para soltar el cuerpo"],
              free: false,
            },
            {
              img: "/images/landing/rejuvenece.webp",
              w: 900,
              h: 1125,
              name: rejuv.name,
              tag: `${rejuv.classes} clases · gratis`,
              text: `${rejuv.perWeek} rutinas cortas por semana durante ${rejuv.weeks} semanas para quemar grasa y tonificar todo el cuerpo.`,
              items: ["Rutinas de unos 15 minutos", "2 semanas de fortalecimiento y 2 de quema de grasa", "Ideal para seguir después del reto o hacerlo en paralelo"],
              free: true,
            },
          ].map((p) => (
            <article key={p.name} className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/5">
              <div className="relative">
                <Image src={p.img} alt={`Vista del programa ${p.name}`} width={p.w} height={p.h} sizes="(max-width: 768px) 100vw, 480px" className={`aspect-[4/3] w-full object-cover ${p.free ? "object-[50%_72%]" : ""}`} />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[14px] font-extrabold text-white ${p.free ? "bg-price" : "bg-brand"}`}>
                  {p.tag}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-[22px] font-extrabold leading-snug">{p.name}</h3>
                <p className="mt-2 text-[16px] text-muted">{p.text}</p>
                <ul className="mt-4 space-y-2">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-3 text-[15px]">
                      <Check />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 7 · Acompañamiento */}
      <Section>
        <div className="grid items-center gap-10 md:grid-cols-[3fr_2fr]">
          <div>
            <Eyebrow>No estás sola</Eyebrow>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[36px]">
              Cuando tengas una duda, no la resolvés sola: te responde Coach Lulú.
            </h2>
            <p className="mt-4 text-[17px] text-ink/85">
              Dentro de la app tenés a Coach Lulú, una asistente virtual que conoce tu plan, tus clases y las recetas. Le escribís a cualquier hora
              y te responde al momento.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "«No sé qué comer hoy»: te arma ideas con las recetas de la app",
                "«Me molesta la espalda»: te dice cómo adaptar el ejercicio",
                "«Falté unos días, ¿cómo sigo?»: te ayuda a retomar sin culpa",
                "Tu progreso y tu racha te muestran cuánto avanzaste",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-[16px]">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] text-muted">Coach Lulú es una asistente con inteligencia artificial. No reemplaza a tu médica o médico.</p>
          </div>
          <Phone src="/images/landing/app-coach.webp" alt="Pantalla de Coach Lulú en la app" />
        </div>
      </Section>

      {/* 8 · La app */}
      <Section tone="dark">
        <div className="text-center">
          <Eyebrow light>La app de alumnas</Eyebrow>
          <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[38px]">No es un PDF. Es tu clase, adentro del celular.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[17px] text-white/85">
            Todo ordenado día por día, para que no tengas que pensar qué hacer. Estas son pantallas reales de la app.
          </p>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {appFeatures.map((f) => (
            <li key={f.title} className="text-center">
              <Phone src={f.src} alt={`Pantalla de la app: ${f.title}`} />
              <p className="mt-5 text-[19px] font-extrabold">{f.title}</p>
              <p className="mt-1 text-[15px] text-white/80">{f.text}</p>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-2xl text-center text-[16px] text-white/85">
          Además: tip del día, guía de bienvenida, modo oscuro y la opción de instalarla en la pantalla de inicio como cualquier otra app.
        </p>
      </Section>

      {/* 9 · Los próximos 28 días */}
      <Section>
        <div className="text-center">
          <Eyebrow>Paso a paso</Eyebrow>
          <h2 className="mt-2 text-[28px] font-extrabold leading-tight md:text-[38px]">Tus próximos 28 días</h2>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {weeks.map((w) => (
            <li key={w.n} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.12em] text-brand">Semana {w.n}</p>
              <p className="mt-1 text-[20px] font-extrabold">{w.name}</p>
              <p className="mt-2 text-[15px] text-muted">{w.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 10 · Testimonios reales (se muestran solo si hay reseñas aprobadas con consentimiento) */}
      <div className="mx-auto max-w-3xl px-4 pb-14 empty:hidden">
        <ChatTestimonials className="mt-0" />
        <TestimonialCarousel />
        <ReviewList />
      </div>

      {/* 11 · Precio por clase */}
      <Section tone="soft">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-extrabold leading-tight md:text-[36px]">
            {totalClasses} clases por {price.offerLabel}: menos de {formatMoney(perClass)} por clase.
          </h2>
          <p className="mt-4 text-[17px] text-ink/85">
            Sin viajar, sin horarios y sin cuota mensual. Pagás una vez y los 2 programas quedan en tu app.
          </p>
        </div>
      </Section>

      {/* 12 · Todo lo que te llevás + 13 · Oferta */}
      <Section id="oferta" className="scroll-mt-4">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-[28px] font-extrabold leading-tight md:text-[36px]">Todo lo que te llevás</h2>
            <ul className="mt-6 space-y-4">
              {stack.map((s) => (
                <li key={s.name} className="flex gap-3">
                  <Check />
                  <div>
                    <p className="text-[17px] font-extrabold">{s.name}</p>
                    <p className="text-[15px] text-muted">{s.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-brand/10 ring-2 ring-price/30 md:sticky md:top-6">
            <p className="text-center text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">Empezá tu reto hoy</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Image src="/images/mockup.webp" alt={reto.productName} width={896} height={1120} sizes="200px" className="aspect-[4/5] w-full rounded-2xl object-cover" />
              <div className="relative">
                <Image src="/images/landing/rejuvenece.webp" alt={rejuv.name} width={900} height={1125} sizes="200px" className="aspect-[4/5] w-full rounded-2xl object-cover" />
                <span className="absolute bottom-2 left-2 rounded-full bg-price px-2.5 py-0.5 text-[12px] font-extrabold text-white">GRATIS</span>
              </div>
            </div>
            <div className="mt-5 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[18px] text-muted line-through">{price.listLabel}</span>
                {price.discount > 0 ? (
                  <span className="rounded-full bg-price px-3 py-1 text-[14px] font-extrabold text-white">{price.discount}% OFF</span>
                ) : null}
              </div>
              <p className="mt-1 text-5xl font-extrabold tracking-tight text-price tabular-nums">
                {price.offerLabel}
                <span className="ml-1 align-top text-base font-bold text-muted">{price.currency}</span>
              </p>
              {price.installments ? (
                <p className="mt-1 text-[16px] font-semibold">
                  o {price.installments} cuotas sin interés de {price.installmentLabel}
                </p>
              ) : null}
              <p className="mt-1 text-[14px] text-muted">Pago único · sin suscripción · los 2 programas</p>
            </div>
            <div className="mt-5">
              <LandingBuy position="bottom" note={false} />
            </div>
            <p className="mt-3 text-center text-[14px] text-muted">{funnel.offer.checkoutNote}</p>
          </div>
        </div>
      </Section>

      {/* 14 · Garantía */}
      <Section tone="dark">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <span aria-hidden="true" className="flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-4 border-white">
            <span className="text-4xl font-extrabold leading-none">{guarantee.days}</span>
            <span className="text-[13px] font-bold uppercase">días</span>
          </span>
          <div>
            <h2 className="text-[26px] font-extrabold leading-tight md:text-[32px]">Probalo {guarantee.days} días. Si no es para vos, te devolvemos todo.</h2>
            <p className="mt-3 text-[17px] text-white/85">{funnel.offer.guaranteeText(guarantee.days)}</p>
          </div>
        </div>
      </Section>

      {/* 15 · ¿Es para vos? */}
      <Section>
        <h2 className="text-center text-[28px] font-extrabold md:text-[36px]">¿Es para vos?</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
            <p className="text-[18px] font-extrabold text-price">Es para vos si…</p>
            <ul className="mt-4 space-y-3">
              {forYou.map((t) => (
                <li key={t} className="flex gap-3 text-[16px]">
                  <Check />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
            <p className="text-[18px] font-extrabold text-brand-dark">No es para vos si…</p>
            <ul className="mt-4 space-y-3">
              {notForYou.map((t) => (
                <li key={t} className="flex gap-3 text-[16px]">
                  <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-[13px] font-bold text-brand-dark">
                    ✕
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 16 · Cómo lo recibís */}
      <Section tone="soft">
        <div className="grid items-center gap-10 md:grid-cols-[3fr_2fr]">
          <div>
            <h2 className="text-[28px] font-extrabold leading-tight md:text-[36px]">Cómo lo recibís (en 2 minutos)</h2>
            <ol className="mt-6 space-y-5">
              {[
                { t: "Hacés el pago", d: "Con Mercado Pago, tarjeta o transferencia, en el checkout seguro." },
                { t: "Te llega el acceso por email", d: "Apenas se confirma el pago. Revisá también spam o promociones." },
                { t: "Abrís la app y empezás tu día 1", d: "Desde el celular, la tablet o la compu. Los 2 programas ya están adentro." },
              ].map((s, i) => (
                <li key={s.t} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-[18px] font-extrabold text-white">{i + 1}</span>
                  <div>
                    <p className="text-[18px] font-extrabold">{s.t}</p>
                    <p className="text-[15px] text-muted">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <Phone src="/images/landing/app-hoy.webp" alt="Pantalla de inicio de la app con la clase del día" />
        </div>
      </Section>

      {/* 17 · FAQ */}
      <div className="mx-auto max-w-3xl px-4 pb-6">
        <Faq items={faq} />
      </div>

      {/* 18 · Cierre */}
      <Section tone="soft" className="mt-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[28px] font-extrabold leading-tight md:text-[38px]">
            Dentro de 28 días el tiempo va a pasar igual. La pregunta es cómo te vas a sentir.
          </h2>
          <p className="mt-4 text-[17px] text-ink/85">
            Una clase corta por día, en tu casa. Empezá hoy con los 2 programas por {price.offerLabel}.
          </p>
          <div className="mx-auto mt-6 max-w-sm">
            <LandingBuy />
          </div>
        </div>
      </Section>

      <footer className="px-4 py-10 text-center text-[13px] text-muted">
        <p>
          {brand.name}
          {brand.supportEmail ? ` · ${brand.supportEmail}` : null}
        </p>
        <p className="mx-auto mt-1 max-w-2xl">
          Este programa no reemplaza la consulta con un profesional de la salud. Si tenés una lesión o condición médica, consultá con tu médico
          antes de empezar. Los resultados varían según cada persona. Las imágenes son ilustrativas.
        </p>
      </footer>

      <StickyBuy />
    </div>
  );
}
