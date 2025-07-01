import { ignores } from 'eslint-config';

export default {
  ignores: [
    'node_modules/**',
    'dist/**',
    '.next/**',
    'build/**',
    'coverage/**',
    '*.config.js',
    '*.config.ts',
    '*.config.mjs',
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'react/prop-types': 'off',
  },
};
