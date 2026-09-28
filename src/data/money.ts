/** "$29.99" o "Item total: $39.98" -> 3999 / 3998. Trabajo en centavos para evitar errores de coma flotante. */
export function toCents(text: string): number {
  const match = text.match(/\$(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`No encontré un monto en "${text}"`);
  return Math.round(Number(match[1]) * 100);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
