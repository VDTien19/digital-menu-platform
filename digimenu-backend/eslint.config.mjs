import js from '@eslint/js';
import globals from 'globals';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

// Nhập các cấu hình từ plugin:import/recommended và plugin:prettier/recommended
const importRecommended = {
  plugins: {
    import: importPlugin,
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
  },
};

const prettierRecommended = {
  plugins: {
    prettier: prettierPlugin,
  },
  rules: {
    'prettier/prettier': 'error',
  },
};

export default [
  {
    // Bỏ qua các thư mục/file không cần lint
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    // Cấu hình cho các file JS
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2025,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importRecommended.rules,
      ...prettierRecommended.rules,
      'no-console': 'warn',
      'import/no-unresolved': 'error',
      'import/order': ['error', { 'newlines-between': 'always' }],
      'no-unused-vars': 'warn',
    },
  },
];
