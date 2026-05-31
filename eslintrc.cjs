// .eslintrc.cjs
// Konfigurasi ini digunakan oleh `next lint` (Next.js 13 built-in ESLint v8).
// Bersifat komplementer dengan eslint.config.js untuk kompatibilitas penuh.

module.exports = {
  extends: [
    "next",                  // Next.js core rules
    "next/core-web-vitals",  // Strict rules for performance (LCP, CLS, etc.)
  ],
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // ─── Next.js / React Rules ──────────────────────────────────────────────
    "react/react-in-jsx-scope": "off",   // Next.js auto-imports React
    "react/prop-types": "off",
    "react/no-unescaped-entities": "warn",
    "react/jsx-key": "error",

    // ─── Code Quality ───────────────────────────────────────────────────────
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-console": "warn",
    "prefer-const": "error",
    "no-var": "error",
  },
};
