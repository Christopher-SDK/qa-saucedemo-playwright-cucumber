import { Page } from '@playwright/test';

/**
 * Clase base de todos los page objects. La mantengo mínima a propósito: solo lo que
 * de verdad comparten todas las páginas. Cada página define su propia ruta para que
 * los steps puedan preguntar "¿estoy en tal página?" sin conocer URLs.
 */
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Regex de la URL de esta página; la uso con expect(page).toHaveURL(). */
  get urlPattern(): RegExp {
    const escaped = this.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`${escaped}$`);
  }
}
