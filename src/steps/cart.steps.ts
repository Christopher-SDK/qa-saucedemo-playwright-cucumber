import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from '../support/expect';
import { CustomWorld } from '../support/world';
import { toCents } from '../data/money';

async function addProduct(world: CustomWorld, name: string): Promise<void> {
  // Guardo el precio tal como lo muestra el catálogo antes de agregarlo (ver AddedProduct en world.ts).
  const priceCents = toCents(await world.inventoryPage.priceOf(name));
  await world.inventoryPage.addToCart(name);
  world.addedProducts.push({ name, priceCents });
}

function forgetProduct(world: CustomWorld, name: string): void {
  world.addedProducts = world.addedProducts.filter((p) => p.name !== name);
}

async function addOne(this: CustomWorld, name: string): Promise<void> {
  await addProduct(this, name);
}

async function addMany(this: CustomWorld, table: DataTable): Promise<void> {
  for (const { producto } of table.hashes()) {
    await addProduct(this, producto);
  }
}

// Registro cada acción dos veces: en presente ("Cuando agrego...") cuando es lo que el escenario
// prueba, y en pasado ("Dado que agregué...") cuando es solo una precondición. Así el Gherkin
// se lee natural y el código detrás es exactamente el mismo.
When('agrego el producto {string} al carrito', addOne);
Given('que agregué el producto {string} al carrito', addOne);
When('agrego los siguientes productos al carrito:', addMany);
Given('que agregué los siguientes productos al carrito:', addMany);

When('quito el producto {string} desde la página de productos', async function (this: CustomWorld, name: string) {
  await this.inventoryPage.removeFromCart(name);
  forgetProduct(this, name);
});

When('quito el producto {string} del carrito', async function (this: CustomWorld, name: string) {
  await this.cartPage.remove(name);
  forgetProduct(this, name);
});

When('abro el carrito', async function (this: CustomWorld) {
  await this.header.openCart();
  await expect(this.page).toHaveURL(this.cartPage.urlPattern);
});

Then('el contador del carrito debería mostrar {int}', async function (this: CustomWorld, count: number) {
  await expect(this.header.cartBadge).toHaveText(String(count));
});

Then('el carrito debería estar vacío', async function (this: CustomWorld) {
  // Cuando no hay productos Sauce Demo quita el badge del DOM, no lo muestra en 0.
  await expect(this.header.cartBadge).toHaveCount(0);
});

Then(
  'el botón del producto {string} debería decir {string}',
  async function (this: CustomWorld, name: string, label: string) {
    await expect(this.inventoryPage.itemButton(name)).toHaveText(label);
  },
);

Then(
  'debería ver en el carrito exactamente estos productos:',
  async function (this: CustomWorld, table: DataTable) {
    const expected = table.hashes().map((row) => ({
      name: row.producto,
      price: row.precio,
      quantity: Number(row.cantidad),
    }));
    // Espero primero a que la cantidad de filas coincida (esto sí reintenta solo)
    // y recién ahí leo el contenido para comparar la lista completa de una vez.
    await expect(this.cartPage.items).toHaveCount(expected.length);
    expect(await this.cartPage.lines()).toEqual(expected);
  },
);
