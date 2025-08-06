import js from '@eslint/js';

export default [
  {
    ignores: ['dist', 'node_modules', '**/*.astro'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^React$' }],
    },
  },
];
