# Automatización E2E de Sauce Demo — Playwright + Cucumber

[![CI](https://github.com/Christopher-SDK/qa-saucedemo-playwright-cucumber/actions/workflows/e2e.yml/badge.svg)](https://github.com/Christopher-SDK/qa-saucedemo-playwright-cucumber/actions/workflows/e2e.yml)

Suite de pruebas automatizadas para [Sauce Demo](https://www.saucedemo.com/) escrita con
**Playwright** para manejar el navegador y **Cucumber** para describir los escenarios en Gherkin
(en español). El código está en TypeScript y sigue el patrón **Page Object Model**.

Cubre la historia de usuario completa del reto: iniciar sesión, agregar productos al carrito,
revisarlos y completar la compra hasta la confirmación, con escenarios positivos y negativos para
`standard_user` y `locked_out_user` (y algunos perfiles más, explico por qué más abajo).

El informe con la estrategia y los patrones usados está en [`docs/INFORME.md`](docs/INFORME.md).

## Requisitos

- Node.js 18 o superior (lo probé con Node 22 y 23)
- npm
- Git

No hace falta instalar navegadores a mano; Playwright los descarga con el comando de abajo.

## Instalación

```bash
git clone https://github.com/Christopher-SDK/qa-saucedemo-playwright-cucumber.git
cd qa-saucedemo-playwright-cucumber
npm install
npx playwright install chromium        # o: npm run install:browsers  (instala los 3)
```

Opcional: si quieres cambiar algún valor por defecto (navegador, modo headed, paralelismo...),
copia `.env.example` como `.env` y edítalo. Sin `.env` la suite funciona igual.

## Cómo ejecutar

| Qué quiero hacer                                  | Comando                                 |
|---------------------------------------------------|-----------------------------------------|
| Correr toda la suite (Chromium, headless)         | `npm test`                              |
| Solo los escenarios críticos (smoke)              | `npm run test:smoke`                    |
| Ver el navegador mientras corre                   | `npm run test:headed`                   |
| Correr en Firefox / WebKit (Safari)               | `npm run test:firefox` / `npm run test:webkit` |
| Correr por tag                                    | `npm run test:tag -- "@carrito"`        |
| Combinar tags                                     | `npm run test:tag -- "@compra and @negativo"` |
| Una sola feature                                  | `npx cucumber-js features/login.feature` |
| Chequear tipos de TypeScript                      | `npm run typecheck`                     |

### Tags disponibles

- Por funcionalidad: `@login`, `@carrito`, `@compra`
- Por tipo de caso: `@positivo`, `@negativo`, `@seguridad`
- Por alcance: `@smoke` (lo mínimo para saber si el sitio "está vivo"), `@e2e` (flujo completo de compra)
- `@otros-usuarios`: perfiles adicionales de Sauce Demo

### Variables de entorno

| Variable           | Por defecto                 | Para qué sirve |
|--------------------|-----------------------------|----------------|
| `BASE_URL`         | `https://www.saucedemo.com` | Ambiente contra el que corre |
| `BROWSER`          | `chromium`                  | `chromium`, `firefox` o `webkit` |
| `HEADLESS`         | `true`                      | `false` para ver el navegador |
| `SLOW_MO`          | `0`                         | Pausa en ms entre acciones (para demos) |
| `PARALLEL`         | `2`                         | Escenarios en paralelo |
| `TRACE_ON_FAILURE` | `true`                      | Guarda un trace de Playwright cuando algo falla |
| `SAUCE_PASSWORD`   | `secret_sauce`              | Contraseña de los usuarios |

## Reportes

Después de cada ejecución se genera la carpeta `reports/`:

- `cucumber-report.html` — el reporte para leer: features, escenarios, pasos y tiempos.
  Si un escenario falla, trae adjunto el **screenshot** del momento del error.
- `cucumber-report.json` y `junit.xml` — para integrarlo con otras herramientas de CI.
- `traces/` — solo si algo falló. Cada `.zip` se abre con
  `npx playwright show-trace reports/traces/<archivo>.zip` y muestra paso a paso el DOM, la red y la consola.

## Estructura del proyecto

```
features/                   Escenarios en Gherkin (español)
  login.feature
  carrito.feature
  compra.feature
src/
  pages/                    Page Objects: un archivo por pantalla
    BasePage.ts
    LoginPage.ts, InventoryPage.ts, CartPage.ts,
    CheckoutInfoPage.ts, CheckoutOverviewPage.ts, CheckoutCompletePage.ts
    components/             Piezas que se repiten en varias pantallas (header, filas del carrito)
  steps/                    Step definitions, agrupados por funcionalidad
  support/                  World de Cucumber, hooks, configuración
  data/                     Usuarios, datos de clientes y utilidades de montos
cucumber.js                 Configuración de Cucumber (formatos, paralelismo, perfiles)
.github/workflows/e2e.yml   Pipeline de GitHub Actions
docs/INFORME.md             Estrategia de automatización y patrones
```

## Cobertura de los criterios de aceptación

| # | Criterio                                              | Dónde se prueba |
|---|-------------------------------------------------------|-----------------|
| 1 | Iniciar sesión con credenciales válidas               | `login.feature` → "Inicio de sesión exitoso con el usuario estándar" |
| 2 | No poder iniciar sesión con credenciales inválidas    | `login.feature` → usuario bloqueado + esquema con 6 combinaciones inválidas |
| 3 | Agregar un producto al carrito desde productos        | `carrito.feature` → "Agregar un producto al carrito desde la página de productos" |
| 4 | Ver los productos agregados en el carrito             | `carrito.feature` → "Ver en el carrito los productos agregados" (nombre, precio y cantidad) |
| 5 | Completar la compra hasta la confirmación             | `compra.feature` → "Completar la compra de un producto hasta la confirmación" |

En total son **25 escenarios / 130 pasos**, y pasan en Chromium, Firefox y WebKit.

## Qué agregué además de lo pedido (y por qué)

- **Validación de montos del checkout.** Compruebo que el subtotal sea la suma de los precios que
  mostraba el catálogo, que el impuesto sea el 8% y que el total cuadre. Es el punto donde un error
  le cuesta dinero real al cliente, así que me pareció el caso de más valor fuera de lo pedido.
- **Casos negativos del formulario de envío** (nombre, apellido y código postal vacíos) y
  **acceso directo al catálogo sin login**, que es un control de seguridad básico.
- **Logout y persistencia del carrito** después de cerrar sesión.
- **Otros perfiles de Sauce Demo** (`problem_user`, `performance_glitch_user`, `error_user`,
  `visual_user`). El más útil es `performance_glitch_user`: demora varios segundos en entrar, así
  que confirma que la suite no depende de esperas fijas.
- **Cross-browser**: la misma suite corre en Chromium, Firefox y WebKit cambiando solo una variable.
- **Ejecución en paralelo** con un contexto de navegador limpio por escenario.
- **Evidencia automática al fallar**: screenshot dentro del reporte + trace de Playwright.
- **Pipeline de GitHub Actions** que corre la suite en los 3 navegadores en cada push, en cada PR y
  una vez al día, y deja los reportes descargables.

## Problemas comunes

- `browserType.launch: Executable doesn't exist` → falta instalar el navegador:
  `npx playwright install chromium` (o el que estés usando).
- Timeouts esporádicos → Sauce Demo es un sitio público; baja el paralelismo con `PARALLEL=1 npm test`.
