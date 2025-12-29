import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  {
    // Apply to all JavaScript and TypeScript files
    files: ["**/*.{js,jsx,ts,tsx}"],

    // Ignore build outputs, dependencies, and generated files
    ignores: [
      ".next/**",              // Next.js build output
      "node_modules/**",       // Dependencies
      "out/**",                // Export output
      "build/**",              // Build directory
      "public/**",             // Static files
      "**/*.d.ts",             // TypeScript declaration files
      "**/*.d.ts.map",         // Declaration source maps
      "next.config.*",         // Next.js config files
      ".next/types/**",        // Next.js generated types
      "eslint.config.js",      // This config file itself
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
      // React Hooks - Enforce hooks best practices
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React - Code quality and consistency
      "react/self-closing-comp": "error",
      "react/button-has-type": "error",

      // TypeScript - Type safety
      "@typescript-eslint/no-unused-vars": ["error", {
        argsIgnorePattern: "^_",        // Ignore unused args starting with _
        varsIgnorePattern: "^_",        // Ignore unused vars starting with _
        caughtErrorsIgnorePattern: "^_" // Ignore unused catch errors starting with _
      }],
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type when needed

      // Accessibility - WCAG compliance (critical rules as errors)
      ...jsxA11y.configs.recommended.rules,
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/no-static-element-interactions": "error",
      "jsx-a11y/label-has-associated-control": "error",
      "jsx-a11y/no-redundant-roles": "error",

      // Next.js - Framework-specific optimizations and best practices
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "warn",

      // General code quality
      "no-console": "off",      // Allow console statements for debugging
      "prefer-const": "error",  // Enforce const for variables that are never reassigned
    },
  },
];