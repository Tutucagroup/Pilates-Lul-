import { ChevronDown, Mail, MessageCircle, Smartphone } from "lucide-react";
import { Back } from "@/components/Back";
import { Card, PageTitle } from "@/components/ui";
import { contact } from "@/data/contact";
import { faqs } from "@/data/faq";

const cats = ["El programa", "Salud", "La app"] as const;

export default function Ayuda() {
  const hasContact = contact.email || contact.whatsapp || contact.instagram;
  return (
    <div className="animate-fade-up pt-1">
      <Back />
      <PageTitle title="Ayuda" subtitle="Respuestas rápidas" />

      {cats.map((cat) => (
        <section key={cat} className="mb-6">
          <h2 className="mb-2 text-[12.5px] font-extrabold uppercase tracking-[0.12em] text-brand">{cat}</h2>
          <div className="space-y-2">
            {faqs.filter((f) => f.cat === cat).map((f) => (
              <details key={f.q} className="group rounded-2xl bg-surface ring-1 ring-line">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown size={20} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-4 pb-4 text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <Card id="instalar">
        <h2 className="flex items-center gap-2 font-display text-[22px] font-semibold"><Smartphone size={22} className="text-brand" /> Instalar la app</h2>
        <p className="mt-1 text-muted">Así te queda un ícono en la pantalla del celular, como cualquier app.</p>
        <h3 className="mt-4 font-bold">En iPhone</h3>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>Abrí esta página en Safari.</li>
          <li>Tocá el botón Compartir (el cuadrado con la flecha hacia arriba).</li>
          <li>Elegí «Agregar a inicio» y confirmá.</li>
        </ol>
        <h3 className="mt-4 font-bold">En Android</h3>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>Abrí esta página en Chrome.</li>
          <li>Tocá los tres puntitos de arriba a la derecha.</li>
          <li>Elegí «Instalar app» o «Agregar a la pantalla principal».</li>
        </ol>
      </Card>

      {hasContact && (
        <Card className="mt-3">
          <h2 className="font-display text-[22px] font-semibold">Escribinos</h2>
          <div className="mt-3 space-y-2">
            {contact.whatsapp && (
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-2xl bg-bg px-4 font-bold"><MessageCircle size={20} className="text-sage" /> WhatsApp</a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex min-h-12 items-center gap-3 rounded-2xl bg-bg px-4 font-bold"><Mail size={20} className="text-brand" /> {contact.email}</a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center gap-3 rounded-2xl bg-bg px-4 font-bold">Instagram</a>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
