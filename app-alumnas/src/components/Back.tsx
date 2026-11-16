import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function Back({ href = "/mas", label = "Más" }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="-ml-2 inline-flex min-h-11 items-center gap-1.5 px-2 font-bold text-muted">
      <ArrowLeft size={19} /> {label}
    </Link>
  );
}
