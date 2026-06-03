const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Path to your Next.js app to load next.config.js and .env files
  dir: './',
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterFramework: ['<rootDir>/jest.setup.js'],
  setupFilesAfterFramework: undefined,
  setupFilesAfterFramework: undefined,

  // Use correct key name
  setupFilesAfterEach: undefined,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  testEnvironment: 'jest-environment-jsdom',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/*.(spec|test).[jt]s?(x)',
    '<rootDir>/__tests__/**/*.(spec|test).[jt]s?(x)',
  ],

  // Exclude E2E tests from Jest
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/e2e/',
    '<rootDir>/src/__test__/integration/',
  ],

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/_app.{js,jsx,ts,tsx}',
    '!src/**/_document.{js,jsx,ts,tsx}',
    '!src/**/layout.{js,jsx,ts,tsx}',
  ],

  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },

  coverageReporters: ['text', 'lcov', 'html'],
};

module.exports = createJestConfig(customJestConfig);
