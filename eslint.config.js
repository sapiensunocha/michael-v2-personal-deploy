// eslint.config.js
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import nextPlugin from "@next/eslint-plugin-next";

export default [
  // 1. Global ignores for build output and node modules
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**', 'public/data/recent_disasters.json'],
  },

  // 2. Apply general recommended JavaScript rules
  js.configs.recommended,

  // 3. Apply recommended React rules and settings (for all JS/TS files with JSX)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ...reactPlugin.configs.recommended, // Merges recommended rules/settings from react-plugin
    settings: {
      react: {
        version: 'detect', // Auto-detect React version
      },
    },
  },

  // 4. Apply recommended TypeScript rules and configure parser for TS/TSX files
  // The 'recommended' configs from 'typescript-eslint' already include the parser setup
  ...tseslint.configs.recommended, // Spreads multiple config objects into the array
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser, // Explicitly ensure TypeScript parser for these files
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    // **REMOVED `plugins` key here** - it's handled by `tseslint.configs.recommended`
  },

  // 5. Apply recommended Next.js rules for App Router projects
  nextPlugin.configs.recommended,
  nextPlugin.configs["core-web-vitals"],

  // 6. Custom rules and overrides (applied globally to all relevant files)
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    // **REMOVED `plugins` key here.**
    // Plugins for rules referenced (like @typescript-eslint/...) are provided by the `extends` above.
    rules: {
      // --- Your specific rule overrides and disables ---
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      'react/no-unknown-property': 'off',
      'no-prototype-builtins': 'off',
      'no-useless-catch': 'off',
      'no-useless-escape': 'off',
      'no-unused-vars': 'off', // Turn off base JS rule, use TS version
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Add or remove any other custom rules here
    },
  },

  // 7. Specific Configuration for JavaScript/JSX files parser
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["next/babel"],
        },
      },
    },
  },
];