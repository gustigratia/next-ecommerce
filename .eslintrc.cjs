module.exports = {
  extends: [
    "next",                  
    "next/core-web-vitals",  
  ],
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off",   
    "react/prop-types": "off",
    "react/no-unescaped-entities": "warn",
    "react/jsx-key": "error",
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
