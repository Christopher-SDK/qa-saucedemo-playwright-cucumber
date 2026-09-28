import { Locator } from '@playwright/test';

export interface CartLine {
  name: string;
  price: string;
  quantity: number;
}

/**
 * El carrito y el resumen del checkout muestran los productos con exactamente el mismo
 * markup, así que la lectura de filas la dejo en un solo lugar y la usan las dos páginas.
 */
export async function readCartLines(items: Locator): Promise<CartLine[]> {
  const lines: CartLine[] = [];
  for (const item of await items.all()) {
    lines.push({
      name: (await item.getByTestId('inventory-item-name').innerText()).trim(),
      price: (await item.getByTestId('inventory-item-price').innerText()).trim(),
      quantity: Number(await item.getByTestId('item-quantity').innerText()),
    });
  }
  return lines;
}
