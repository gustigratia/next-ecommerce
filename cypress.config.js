const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',

    setupNodeEvents(on, config) {
      return config;
    },
  },

  viewportWidth: 1280,
  viewportHeight: 720,

  retries: {
    runMode: 2,
    openMode: 0,
  },

  video: true,
  screenshotOnRunFailure: true,
});
