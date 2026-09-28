import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '../support/expect';
import { CustomWorld } from '../support/world';
import { getUser } from '../data/users';

Given('que estoy en la página de inicio de sesión', async function (this: CustomWorld) {
  await this.loginPage.open();
});

// Este es el "atajo" para las features de carrito y compra: ahí el login no es lo que estoy
// probando, es solo una precondición. Por eso abro la página, entro y confirmo que llegué
// al catálogo; si esto falla, el error apunta al login y no a un paso posterior.
Given('que inicié sesión como {string}', async function (this: CustomWorld, userName: string) {
  const { username, password } = getUser(userName);
  await this.loginPage.open();
  await this.loginPage.login(username, password);
  await expect(this.page).toHaveURL(this.inventoryPage.urlPattern);
});

// "(que )" es texto opcional de Cucumber Expressions: el mismo step sirve para
// "Cuando inicio sesión como..." y para "Dado que inicio sesión como...".
When('(que )inicio sesión como {string}', async function (this: CustomWorld, userName: string) {
  const { username, password } = getUser(userName);
  await this.loginPage.login(username, password);
});

// Para credenciales inválidas no paso por el catálogo de usuarios: quiero escribir exactamente
// lo que el escenario indique, incluso campos vacíos.
When(
  'ingreso el usuario {string} y la contraseña {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await this.loginPage.login(username, password);
  },
);

When('intento abrir directamente la página del catálogo', async function (this: CustomWorld) {
  await this.inventoryPage.open();
});

When('cierro sesión', async function (this: CustomWorld) {
  await this.header.logout();
});

Then('debería ver el catálogo de productos', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(this.inventoryPage.urlPattern);
  await expect(this.inventoryPage.title).toHaveText('Products');
  // Valido que haya productos cargados y no solo el título: un catálogo vacío también sería un bug.
  await expect(this.inventoryPage.items.first()).toBeVisible();
});

Then('debería seguir en la página de inicio de sesión', async function (this: CustomWorld) {
  await expect(this.loginPage.loginButton).toBeVisible();
  await expect(this.inventoryPage.items).toHaveCount(0);
});

Then(
  'al intentar abrir directamente la página del catálogo debería ser rechazado',
  async function (this: CustomWorld) {
    // Esto confirma que el logout de verdad cerró la sesión y no solo cambió de pantalla.
    await this.inventoryPage.open();
    await expect(this.loginPage.errorMessage).toContainText("You can only access '/inventory.html'");
  },
);
