// Configuración de Cucumber. Dejo todo acá (y no en flags sueltos del package.json)
// para que cualquiera vea en un solo lugar cómo se ejecuta la suite.
require('dotenv').config({ quiet: true });

const common = {
  // Uso ts-node para escribir los steps y page objects en TypeScript sin un paso de build aparte.
  requireModule: ['ts-node/register'],
  require: ['src/support/**/*.ts', 'src/steps/**/*.ts'],
  paths: ['features/**/*.feature'],
  format: [
    'progress-bar',
    'summary',
    // El HTML es el que reviso a mano; el JSON y el JUnit los dejo para CI o para
    // conectarlo después con otro reporte (Jenkins, Azure DevOps, etc.).
    'html:reports/cucumber-report.html',
    'json:reports/cucumber-report.json',
    'junit:reports/junit.xml',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  // Cada escenario abre su propio contexto de navegador, así que puedo correrlos en paralelo
  // sin que se pisen. Lo dejo en 2 por defecto para no saturar saucedemo.com.
  parallel: Number(process.env.PARALLEL ?? 2),
  // En CI le doy un reintento para absorber algún problema de red con el sitio público;
  // en local lo dejo en 0 para que si algo falla lo vea de una.
  retry: process.env.CI ? 1 : 0,
};

module.exports = {
  default: { ...common },
  smoke: { ...common, tags: '@smoke' },
};
