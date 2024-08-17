const js = require('@eslint/js');
const prettier = require('eslint-config-prettier');
const eslintPluginPrettier = require('eslint-plugin-prettier');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');

module.exports = {
  ignores: ['dist/**', 'node_modules/**', '*.config.js'],

  extends: [js.configs.recommended, 'prettier'],

  plugins: {
    '@typescript-eslint': typescriptEslintPlugin,
    prettier: eslintPluginPrettier,
  },
  languageOptions: {
    parser: typescriptEslintParser,
  },

  rules: {
    // Possible errors
    'no-console': 'warn', // Warn about console.log statements

    // Variables
    'no-undef': 'error', // Disallow the use of undeclared variables

    // Best practices
    'consistent-return': 'error', // Require return statements to either always or never specify values
    'no-else-return': 'error', // Disallow `else` blocks after `return` statements
    'no-useless-catch': 'error', // Disallow unnecessary catch clauses
    'no-shadow': 'error', // Disallow variable declarations from shadowing variables declared in the outer scope

    // Code style
    indent: ['error', 2], // Enforce consistent indentation
    quotes: ['error', 'single'], // Enforce the use of single quotes
    semi: ['error', 'always'], // Require semicolons at the end of statements
    'eol-last': ['error', 'always'], // Ensure the file ends with a newline
    'no-magic-numbers': ['warn', { ignoreArrayIndexes: true }], // Disallow magic numbers

    // TypeScript specific
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow functions without return types
    '@typescript-eslint/no-explicit-any': 'warn', // Warn about usage of 'any'
    '@typescript-eslint/ban-ts-comment': 'warn', // Warn about '@ts-ignore' comments
  },
};
