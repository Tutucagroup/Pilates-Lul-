const ars = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });
/** "$5.900" */
export const money = (value: number) => `$${ars.format(value)}`;
