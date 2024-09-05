import globals from 'globals';
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      'no-duplicate-imports': 'error',
      'no-template-curly-in-string': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'consistent-return': 'error',
      curly: 'error',
      'no-var': 'error',
      'default-param-last': 'error',
      'func-style': 'error',
      'guard-for-in': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-template': 'error',
    },
  },
];
