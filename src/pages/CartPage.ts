import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartLine, readCartLines } from './components/cartLines';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  readonly items: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async lines(): Promise<CartLine[]> {
    return readCartLines(this.items);
  }

  async remove(productName: string): Promise<void> {
    // Nombre exacto, igual que en el catálogo: con hasText bastaría que la descripción de otro
    // producto mencionara este nombre para quitar el equivocado.
    const fila = this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
    await fila.getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
