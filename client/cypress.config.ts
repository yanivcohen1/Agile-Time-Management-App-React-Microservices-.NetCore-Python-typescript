import { defineConfig } from "cypress";
import { createRequire } from "module";
import { resolve } from "path";
const require = createRequire(import.meta.url);

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: false,
    reporter: process.env.CYPRESS_REPORTER || 'spec',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: true,
      html: true,
      json: false
    },
    env: {
      NODE_PATH: resolve('./node_modules')
    },
    setupNodeEvents(on) {
      if (process.env.CYPRESS_REPORTER === 'cypress-mochawesome-reporter') {
        require('cypress-mochawesome-reporter/plugin')(on);
      }
      // implement node event listeners here
    },
  },
})
