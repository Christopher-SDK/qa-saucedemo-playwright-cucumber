import { After, AfterAll, Before, BeforeAll, Status } from '@cucumber/cucumber';
import { Browser, chromium, firefox, selectors, webkit } from '@playwright/test';
import { mkdirSync } from 'fs';
import { config } from './config';
import { CustomWorld } from './world';

let browser: Browser;

BeforeAll(async function () {
  // Le digo a Playwright que getByTestId() use el atributo data-test, que es el que trae
  // Sauce Demo en todos sus elementos. Así los locators no dependen de clases CSS ni de textos.
  selectors.setTestIdAttribute('data-test');

  // Levanto el navegador una sola vez por worker (abrirlo por escenario es lo más lento).
  const launcher = { chromium, firefox, webkit }[config.browser];
  browser = await launcher.launch({ headless: config.headless, slowMo: config.slowMo });
});

Before(async function (this: CustomWorld) {
  // Lo que sí creo por escenario es el contexto: es como una ventana de incógnito nueva,
  // sin cookies ni localStorage. Sauce Demo guarda el carrito en localStorage, así que
  // sin esto un escenario podría heredar productos del anterior.
  this.browser = browser;
  this.context = await browser.newContext({ baseURL: config.baseUrl });
  if (config.traceOnFailure) {
    await this.context.tracing.start({ screenshots: true, snapshots: true });
  }
  this.initPages(await this.context.newPage());
});

After(async function (this: CustomWorld, { pickle, result }) {
  const failed = result?.status === Status.FAILED;

  if (failed) {
    // Si falla, adjunto un screenshot directo al reporte HTML: es lo primero que uno quiere ver.
    const screenshot = await this.page.screenshot({ fullPage: true });
    this.attach(screenshot, 'image/png');
  }

  if (config.traceOnFailure) {
    if (failed) {
      // Además guardo el trace: tiene la línea de tiempo, el DOM y la red de cada paso.
      mkdirSync('reports/traces', { recursive: true });
      const name = pickle.name.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
      const path = `reports/traces/${name}_${Date.now()}.zip`;
      await this.context.tracing.stop({ path });
      this.attach(`Trace guardado en ${path} (ábrelo con: npx playwright show-trace ${path})`);
    } else {
      await this.context.tracing.stop();
    }
  }

  await this.context.close();
});

AfterAll(async function () {
  await browser?.close();
});
