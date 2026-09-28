import { DataTable, Then, When } from '@cucumber/cucumber';
import { expect } from '../support/expect';
import { CustomWorld } from '../support/world';
import { defaultCustomer } from '../data/customers';
import { formatCents } from '../data/money';

// Sauce Demo aplica un 8% de impuesto sobre el subtotal. Lo dejo como constante con nombre
// para que se entienda de dónde sale el número y se cambie en un solo lugar si hiciera falta.
const TAX_RATE = 0.08;

When('inicio el checkout', async function (this: CustomWorld) {
  await this.cartPage.checkout();
  await expect(this.page).toHaveURL(this.checkoutInfoPage.urlPattern);
});

When('ingreso mis datos de envío:', async function (this: CustomWorld, table: DataTable) {
  const [row] = table.hashes();
  await this.checkoutInfoPage.fill({
    firstName: row['nombre'],
    lastName: row['apellido'],
    postalCode: row['código postal'],
  });
});

When('ingreso datos de envío válidos', async function (this: CustomWorld) {
  await this.checkoutInfoPage.fill(defaultCustomer);
});

When('continúo con el checkout', async function (this: CustomWorld) {
  await this.checkoutInfoPage.continue();
});

When('finalizo la compra', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.finish();
});

When('cancelo la compra', async function (this: CustomWorld) {
  await this.checkoutOverviewPage.cancel();
});

Then('debería seguir en el paso de datos de envío', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.checkoutInfoPage.urlPattern);
});

Then('el resumen de la compra debería listar los productos que agregué', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.checkoutOverviewPage.urlPattern);
  const expected = this.addedProducts.map((p) => ({ name: p.name, price: formatCents(p.priceCents), quantity: 1 }));
  await expect(this.checkoutOverviewPage.items).toHaveCount(expected.length);
  expect(await this.checkoutOverviewPage.lines()).toEqual(expected);
});

Then('el subtotal debería ser la suma de los precios de los productos', async function (this: CustomWorld) {
  const expected = this.addedProducts.reduce((sum, p) => sum + p.priceCents, 0);
  expect(await this.checkoutOverviewPage.subtotalCents()).toBe(expected);
});

Then('el impuesto debería ser el 8% del subtotal', async function (this: CustomWorld) {
  const subtotal = await this.checkoutOverviewPage.subtotalCents();
  expect(await this.checkoutOverviewPage.taxCents()).toBe(Math.round(subtotal * TAX_RATE));
});

Then('el total debería ser el subtotal más el impuesto', async function (this: CustomWorld) {
  const subtotal = await this.checkoutOverviewPage.subtotalCents();
  const tax = await this.checkoutOverviewPage.taxCents();
  expect(await this.checkoutOverviewPage.totalCents()).toBe(subtotal + tax);
});

Then('debería ver la confirmación {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page).toHaveURL(this.checkoutCompletePage.urlPattern);
  await expect(this.checkoutCompletePage.header).toHaveText(message);
});
