import { brand } from "@/config/brand.config";

/** Porcentaje de descuento redondeado al entero más cercano. 45.000 → 19.900 = 56%. */
export function discountPercent(listPrice: number, offerPrice: number): number {
  if (listPrice <= 0 || offerPrice >= listPrice) return 0;
  return Math.round((1 - offerPrice / listPrice) * 100);
}

/** Valor de cada cuota sin interés, redondeado hacia abajo al peso (19.900 / 3 = 6.633). */
export function installmentAmount(price: number, installments: number): number | null {
  if (!installments || installments < 2) return null;
  return Math.floor(price / installments);
}

const ars = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
/** "$19.900" */
export function formatMoney(value: number): string {
  return `$${ars.format(value)}`;
}

/** Valores derivados de brand.config.ts, listos para mostrar. */
export const price = (() => {
  const { listPrice, offerPrice, installments, currency } = brand.pricing;
  const perInstallment = installmentAmount(offerPrice, installments);
  return {
    currency,
    list: listPrice,
    offer: offerPrice,
    listLabel: formatMoney(listPrice),
    offerLabel: formatMoney(offerPrice),
    discount: discountPercent(listPrice, offerPrice),
    installments: perInstallment ? installments : null,
    installmentLabel: perInstallment ? formatMoney(perInstallment) : null,
  };
})();
