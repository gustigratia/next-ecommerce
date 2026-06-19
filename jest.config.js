/** @type {import('jest').Config} */
const config = {
  // Use Next.js's built-in Jest transformer
  // If the project uses next/jest, swap to: preset: 'ts-jest' or next/jest()
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },

  // Map Next.js server-only modules to safe stubs
  moduleNameMapper: {
    '^next/server$': '<rootDir>/__mocks__/next-server.js',
    '^next/navigation$': '<rootDir>/__mocks__/next-navigation.js',
    '^next/image$': '<rootDir>/__mocks__/next-image.js',
    '^next/link$': '<rootDir>/__mocks__/next-link.js',
    // CSS / static assets
    '^swiper/css$': 'identity-obj-proxy',
    '^swiper/css/(.*)$': 'identity-obj-proxy',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    // Path aliases (adjust if the project uses @/ or ~/src/)
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // ✅ Setup polyfills and test utilities before executing tests
  setupFiles: ['<rootDir>/jest.setup.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],

  // Include all source files so un-tested files still count against coverage
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/page.jsx', // Next.js page shell wrappers (thin wrappers)
    '!src/**/layout.{js,jsx}', // layout files
    '!**/node_modules/**',
  ],

  // Ignore measurement for Next.js app/ folder and other runtime-only files
  coveragePathIgnorePatterns: ['/node_modules/', '/app/', '/public/', '/__mocks__/'],

  testPathIgnorePatterns: [
    '/node_modules/',
    // "<rootDir>/src/__test__/integration",
  ],

  // Coverage thresholds — require at least 90% overall
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },

  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  // Don't transform node_modules (except packages that ship ESM)
  transformIgnorePatterns: ['/node_modules/(?!(some-esm-package)/)'],
};

module.exports = config;
