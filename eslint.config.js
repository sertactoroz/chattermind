import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    // Sadece senin yazdığın dosyaları lint et
    files: ["**/*.{js,jsx,ts,tsx}"],

    // .next, types, config dosyaları vs. tamamen yok sayılır → parsing error = 0
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
      "eslint.config.js",
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
      // React & Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/self-closing-comp": "error",
      "react/button-has-type": "error",

      // TypeScript
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",

      // Accessibility (kritik olanlar error)
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/no-redundant-roles": "error",

      // Next.js resmi kuralları
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Genel temizlik
      "no-console": "off",
      "prefer-const": "error",
      '@typescript-eslint/no-explicit-any': 'off', 
    },
  },
];