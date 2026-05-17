import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],

    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      "public/**",
      "**/*.d.ts",
      "**/*.d.ts.map",
      "next.config.*",
      ".next/types/**",
      "coverage/**",
    ],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: { version: "detect" },
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin,
    },

    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      "react/self-closing-comp": "error",
      "react/button-has-type": "error",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/no-redundant-roles": "error",

      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",

      "no-console": "off",
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
