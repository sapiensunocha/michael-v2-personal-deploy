import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react'; // ✅ Add missing import

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 2021,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react, // ✅ React plugin correctly registered
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules, // ✅ React rules enabled

      // ✅ React 17+ JSX runtime support: don't require `import React`
      'react/react-in-jsx-scope': 'off',

      // ✅ Optional adjustments
      'react/prop-types': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-case-declarations': 'off',
      'no-redeclare': 'error',
      'no-useless-catch': 'error',
      'no-prototype-builtins': 'error',
      'no-useless-escape': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: {
        version: 'detect', // ✅ Automatically detect React version
      },
    },
  },
];