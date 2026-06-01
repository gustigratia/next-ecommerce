// eslint.config.js
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";

export default [
  // Base JS recommended rules
  js.configs.recommended,

  // Rules for all JS/JSX/TS/TSX files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        console: "readonly",
        fetch: "readonly",
        // Node.js globals (for API routes)
        process: "readonly",
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // ─── React Rules ────────────────────────────────────────────────────────
      "react/react-in-jsx-scope": "off",       // Not needed in Next.js (auto import)
      "react/prop-types": "off",               // TypeScript handles type checking
      "react/display-name": "warn",
      "react/no-unescaped-entities": "warn",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-key": "error",               // Always add key in .map()

      // ─── React Hooks Rules ────────────────────────────────────────────────
      "react-hooks/rules-of-hooks": "error",   // Hooks must follow the rules
      "react-hooks/exhaustive-deps": "warn",   // Deps array must be complete

      // ─── General Code Quality ────────────────────────────────────────────
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-console": "warn",                    // Avoid console.log in production
      "prefer-const": "error",                 // Use const where possible
      "no-var": "error",                       // No var, use let/const
      "no-duplicate-imports": "error",
      "eqeqeq": ["warn", "always"],           // Use === instead of ==
    },
  },

  // ─── Ignore Patterns ──────────────────────────────────────────────────────
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "*.config.js",        // next.config.js, postcss.config.js
      "tailwind.config.ts",
    ],
  },
];
