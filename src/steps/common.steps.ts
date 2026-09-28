import { Then } from '@cucumber/cucumber';
import { expect } from '../support/expect';
import { CustomWorld } from '../support/world';

// El login y el checkout muestran sus errores, así que este step lo comparten las dos features.
// Para no tocar selectores aquí, uso los page objects de las dos pantallas y acepto el que esté
// visible (or). No me guío por la URL a propósito: cuando alguien entra al catálogo sin sesión,
// Sauce Demo muestra el login pero la URL sigue siendo /inventory.html.
Then('debería ver el mensaje de error {string}', async function (this: CustomWorld, message: string) {
  const mensaje = this.loginPage.errorMessage.or(this.checkoutInfoPage.errorMessage);
  await expect(mensaje).toHaveText(message);
});
