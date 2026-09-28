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
    await this.items.filter({ hasText: productName }).getByRole('button', { name: 'Remove' }).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
