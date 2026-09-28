import 'dotenv/config';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

// Centralizo acá todo lo que depende del entorno. Así, si mañana hay que apuntar a otro
// ambiente o cambiar de navegador, se hace con variables y no tocando código.
export const config = {
  baseUrl: process.env.BASE_URL ?? 'https://www.saucedemo.com',
  browser: (process.env.BROWSER ?? 'chromium') as BrowserName,
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO ?? 0),
  traceOnFailure: process.env.TRACE_ON_FAILURE !== 'false',
  // 60s por step porque performance_glitch_user tarda varios segundos a propósito en loguearse.
  stepTimeoutMs: 60_000,
  // Timeout de las aserciones de Playwright (expect). Reintentan solas hasta este límite,
  // por eso no necesito ningún sleep en toda la suite.
  expectTimeoutMs: 10_000,
};
