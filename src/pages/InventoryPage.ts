import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  readonly title: Locator;
  readonly items: Locator;

  constructor(page: Page) {
    super(page);
    this.title = page.getByTestId('title');
    this.items = page.getByTestId('inventory-item');
  }

  /**
   * Busco la tarjeta del producto por su nombre visible y no por el id interno
   * (add-to-cart-sauce-labs-backpack). Así el feature habla el idioma del negocio
   * ("Sauce Labs Backpack") y no tengo que mantener un mapa de nombres a ids.
   */
  itemCard(productName: string): Locator {
    return this.items.filter({
      has: this.page.getByTestId('inventory-item-name').getByText(productName, { exact: true }),
    });
  }

  /**
   * El mismo botón cambia de "Add to cart" a "Remove". Filtro por esos dos textos porque la
   * imagen y el título de la tarjeta también tienen role="button" y chocarían con el strict mode.
   */
  itemButton(productName: string): Locator {
    return this.itemCard(productName).getByRole('button', { name: /^(Add to cart|Remove)$/ });
  }

  async priceOf(productName: string): Promise<string> {
    return (await this.itemCard(productName).getByTestId('inventory-item-price').innerText()).trim();
  }

  async addToCart(productName: string): Promise<void> {
    await this.itemCard(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.itemCard(productName).getByRole('button', { name: 'Remove' }).click();
  }
}
