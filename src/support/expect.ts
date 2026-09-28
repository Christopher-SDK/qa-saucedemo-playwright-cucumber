import { expect as baseExpect } from '@playwright/test';
import { config } from './config';

// Uso el expect de Playwright (y no assert de Node) porque sus aserciones sobre locators
// esperan solas a que el elemento cumpla la condición. configure() devuelve una copia con
// mi timeout, por eso los steps importan este expect y no el original.
export const expect = baseExpect.configure({ timeout: config.expectTimeoutMs });
