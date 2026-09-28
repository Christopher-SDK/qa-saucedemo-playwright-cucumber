import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CartLine, readCartLines } from './components/cartLines';
import { toCents } from '../data/money';

export class CheckoutOverviewPage extends BasePage {
  protected readonly path = '/checkout-step-two.html';

  readonly items: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.items = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');
    this.cancelButton = page.getByTestId('cancel');
  }

  async lines(): Promise<CartLine[]> {
    return readCartLines(this.items);
  }

  // Los montos los devuelvo en centavos (enteros). Si trabajara con decimales en JS,
  // 29.99 + 9.99 no da exactamente 39.98 y la comparación fallaría por redondeo.
  async subtotalCents(): Promise<number> {
    return toCents(await this.subtotalLabel.innerText());
  }

  async taxCents(): Promise<number> {
    return toCents(await this.taxLabel.innerText());
  }

  async totalCents(): Promise<number> {
    return toCents(await this.totalLabel.innerText());
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
