import { IWorldOptions, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { config } from './config';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { HeaderComponent } from '../pages/components/HeaderComponent';

setDefaultTimeout(config.stepTimeoutMs);

export interface AddedProduct {
  name: string;
  priceCents: number;
}

/**
 * El World de Cucumber es el "estado" que comparten los steps de un mismo escenario.
 * Aquí guardo el navegador, la página y los page objects. Cucumber crea un World nuevo
 * por escenario, así que nada de un escenario se filtra al siguiente.
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  inventoryPage!: InventoryPage;
  cartPage!: CartPage;
  checkoutInfoPage!: CheckoutInfoPage;
  checkoutOverviewPage!: CheckoutOverviewPage;
  checkoutCompletePage!: CheckoutCompletePage;
  header!: HeaderComponent;

  // Productos que el escenario fue agregando, con el precio que mostraba el catálogo en ese momento.
  // Lo uso después para validar el resumen de compra contra una fuente independiente:
  // si comparara el resumen consigo mismo, un precio mal calculado pasaría desapercibido.
  addedProducts: AddedProduct[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  /** Instancio todos los page objects sobre la misma página una sola vez por escenario. */
  initPages(page: Page): void {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.inventoryPage = new InventoryPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutInfoPage = new CheckoutInfoPage(page);
    this.checkoutOverviewPage = new CheckoutOverviewPage(page);
    this.checkoutCompletePage = new CheckoutCompletePage(page);
    this.header = new HeaderComponent(page);
  }
}

setWorldConstructor(CustomWorld);
