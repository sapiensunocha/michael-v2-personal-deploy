import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin'; // <<< Change this import
import parser from '@typescript-eslint/parser'; // Keep this

export default [
  {
    ignores: ['node_modules/**', '.next/**', 'dist/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser, // Use the parser you imported
      parserOptions: {
        project: ['./tsconfig.json'], // <<< Add this for type-aware linting
        tsconfigRootDir: import.meta.dirname, // <<< Add this
        sourceType: 'module',
        ecmaVersion: 2021,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // ... your globals
      },
    },
    plugins: {
      react,
      '@typescript-eslint': tseslint, // <<< Use the imported plugin directly
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules, // <<< Or tseslint.configs.strictTypeChecked.rules if desired
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-case-declarations': 'off',
      'no-redeclare': 'error',
      'no-useless-catch': 'error',
      'no-prototype-builtins': 'error',
      'no-useless-escape': 'error',
    },
  },
];