module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'import',
    'react-refresh',
    'simple-import-sort',
    'tailwindcss',
    'unused-imports',
  ],
  rules: {
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    'import/extensions': [
      'error',
      'never',
      {
        'scss': 'always',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        'endOfLine': 'auto',
        'singleQuote': true,
      },
    ],
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true,
      },
    ],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
      },
    ],
  },
}
