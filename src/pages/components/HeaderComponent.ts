import { Locator, Page } from '@playwright/test';

/**
 * El header (menú lateral + ícono del carrito) aparece en todas las páginas después del login.
 * En vez de repetirlo en cada page object lo separo como componente: si cambia el header,
 * lo arreglo en un solo lugar.
 */
export class HeaderComponent {
  readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByTestId('logout-sidebar-link');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    // El menú tiene una animación de apertura; click() ya espera a que el link sea clickeable.
    await this.logoutLink.click();
  }
}
