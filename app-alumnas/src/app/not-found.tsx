import { LinkButton } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="pt-16 text-center">
      <h1 className="font-display text-[28px] font-semibold">No encontramos esta página</h1>
      <p className="mt-2 text-muted">Puede que el enlace esté viejo o mal escrito.</p>
      <LinkButton href="/" className="mt-6">Ir al inicio</LinkButton>
    </div>
  );
}
