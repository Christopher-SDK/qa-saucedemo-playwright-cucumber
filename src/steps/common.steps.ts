import { Then } from '@cucumber/cucumber';
import { expect } from '../support/expect';
import { CustomWorld } from '../support/world';

// El login y el checkout muestran sus errores en el mismo contenedor (data-test="error"),
// así que este step lo comparten las dos features y no tengo que duplicarlo.
Then('debería ver el mensaje de error {string}', async function (this: CustomWorld, message: string) {
  await expect(this.page.getByTestId('error')).toHaveText(message);
});
