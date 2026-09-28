# Informe: estrategia de automatización y patrones — Sauce Demo

## 1. Qué había que probar y cómo lo abordé

La historia de usuario es el recorrido de compra de un cliente: entrar, elegir productos, revisarlos
y pagar. Antes de escribir código recorrí el sitio a mano y revisé su HTML para ver con qué contaba.
Lo más importante que encontré es que Sauce Demo pone un atributo `data-test` en prácticamente todos
los elementos, así que decidí basar los selectores en él. Es el atributo que el propio sitio deja
para testing, y no cambia si cambian los estilos o el diseño.

Organicé las pruebas en tres features que siguen el orden natural de la compra:

1. **Login**: el caso feliz, el usuario bloqueado, credenciales inválidas (en un Esquema del
   escenario con 6 combinaciones), acceso sin sesión y logout.
2. **Carrito**: agregar, ver, quitar (desde el catálogo y desde el carrito) y persistencia.
3. **Compra**: el flujo completo hasta "Thank you for your order!", la validación de montos,
   los errores del formulario de envío y la cancelación.

Para cada criterio de aceptación hay al menos un escenario que lo cubre directamente (el mapeo
está en el README) y alrededor de cada uno agregué los casos negativos que un usuario real podría
provocar.

## 2. Por qué Gherkin en español

Escribí los features con `# language: es` porque la historia y los criterios vienen en español y
así cualquier persona del equipo (QA, negocio o desarrollo) puede leerlos y validarlos sin
traducción. Los pasos están en primera persona ("agrego el producto...", "debería ver...") porque
describen lo que hace el cliente, no cómo lo hace el código. En los features no hay selectores,
URLs ni esperas: si mañana cambia la pantalla, los features no se tocan.

Algunas decisiones concretas:

- Uso **Antecedentes** para la precondición común (estar en el login o tener la sesión iniciada).
- Uso **Esquema del escenario** cuando es la misma prueba con distintos datos (credenciales
  inválidas, campos faltantes del checkout, otros perfiles de usuario).
- Uso **tablas de datos** para listas de productos y datos de envío, que se leen mejor que un paso
  con muchos parámetros.
- Separé la precondición ("Dado que agregué...") de la acción ("Cuando agrego..."). Detrás es el
  mismo código, pero el escenario deja claro qué es preparación y qué es lo que se está probando.

## 3. Patrones de diseño

### Page Object Model (principal)

Cada pantalla tiene su clase en `src/pages/`, con sus locators y las acciones que un usuario puede
hacer en ella (`login()`, `addToCart()`, `checkout()`...). Los steps nunca tocan un selector: llaman
métodos del page object. La consecuencia práctica es que si Sauce Demo cambia un botón, el arreglo
se hace en un solo archivo y no en todos los steps que lo usan.

Todas las páginas heredan de `BasePage`, que dejé intencionalmente chica: solo tiene lo que de verdad
comparten (la navegación a su ruta y el patrón de URL para validar en qué página estoy).

### Page Components

El header (menú y carrito) aparece en todas las pantallas después del login, así que lo separé en
`HeaderComponent` en vez de repetirlo en cada page object. Lo mismo con la lectura de filas de
productos, que el carrito y el resumen de compra muestran con el mismo HTML (`cartLines.ts`).

### World de Cucumber como contexto del escenario

El `CustomWorld` (`src/support/world.ts`) es el objeto que comparten todos los pasos de un escenario.
Ahí viven el navegador, la página y los page objects, y también lo que el escenario va acumulando,
como los productos agregados con su precio. Cucumber crea un World nuevo por escenario, así que no
hay estado compartido entre escenarios y pueden correr en paralelo sin problemas.

### Datos de prueba separados del código

Los usuarios y su contraseña están en `src/data/users.ts` (la contraseña se puede sobrescribir por
variable de entorno), el cliente por defecto en `customers.ts` y la conversión de montos en
`money.ts`. En los features solo escribo el nombre del usuario, por ejemplo `"standard_user"`.

## 4. Decisiones técnicas que vale la pena mencionar

- **Sin esperas fijas.** No hay ningún `sleep` ni `waitForTimeout`. Uso las aserciones de Playwright
  (`toHaveText`, `toHaveURL`, `toHaveCount`), que reintentan solas hasta que se cumple la condición
  o se acaba el tiempo. Por eso la suite es estable incluso con `performance_glitch_user`.
- **Aislamiento por escenario.** El navegador se abre una vez por worker, pero cada escenario usa un
  contexto nuevo (equivalente a una ventana de incógnito). Esto importa porque Sauce Demo guarda el
  carrito en `localStorage`: sin contexto nuevo, un escenario podría heredar productos del anterior.
- **Montos en centavos.** En JavaScript `29.99 + 9.99` no da exactamente `39.98`. Para validar el
  checkout convierto todo a enteros en centavos y comparo sin errores de redondeo.
- **Validación contra una fuente independiente.** El subtotal del resumen lo comparo contra los
  precios que mostraba el catálogo al momento de agregar, no contra los precios del mismo resumen.
  Si comparara el resumen consigo mismo, un error de precio pasaría la prueba.
- **Evidencia al fallar.** Cuando un escenario falla se adjunta un screenshot al reporte HTML y se
  guarda un trace de Playwright con la línea de tiempo completa.

## 5. Resultados

- 25 escenarios / 130 pasos, todos en verde.
- Probado en Chromium, Firefox y WebKit.
- Lo corrí varias veces seguidas con 4 escenarios en paralelo para descartar pruebas inestables.
- Duración aproximada: 15–25 segundos en total, según el navegador.

## 6. Lo que haría como siguiente paso

- Pruebas de accesibilidad con `@axe-core/playwright` sobre las pantallas principales.
- Comparación visual (screenshots de referencia) para detectar los defectos de `visual_user`.
- Escenarios que documenten los defectos conocidos de `problem_user` y `error_user`, marcados con
  un tag aparte para no mezclarlos con la regresión.
