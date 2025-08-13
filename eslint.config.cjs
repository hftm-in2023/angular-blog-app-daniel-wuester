const js = require('@eslint/js');
const tseslint = require('typescript-eslint');              // <- liefert parser + plugin
const angular = require('@angular-eslint/eslint-plugin');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname
      }
    },
    plugins: {
      '@angular-eslint': angular,
      '@typescript-eslint': tseslint.plugin                 // <- WICHTIG: Plugin registrieren
    },
    rules: {
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/component-selector': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  }
];
