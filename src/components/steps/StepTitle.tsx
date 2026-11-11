export function StepTitle({ label, title, subtitle }: { label?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6 text-center animate-fade-up">
      <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink">{title}</h1>
      {subtitle ? <p className="mt-2 text-[17px] text-muted">{subtitle}</p> : null}
      {label ? <p className="mt-3 text-[13px] font-extrabold uppercase tracking-[0.14em] text-brand">{label}</p> : null}
    </div>
  );
}
