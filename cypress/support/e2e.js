import './commands';

// Ignore errors from external images/resources so tests focus on app behavior.
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes("Cannot read properties of null (reading 'document')")) {
    return false;
  }

  const ignoredMessages = [
    'ResizeObserver loop limit exceeded',
    'Loading chunk',
    'Hydration failed',
    'Text content does not match server-rendered HTML',
    'There was an error while hydrating',
  ];

  return !ignoredMessages.some((message) => err.message.includes(message));
});
