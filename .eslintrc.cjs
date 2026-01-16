module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    project: './tsconfig.json'
  },

  env: {
    node: true,
    es2024: true
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2]
  },
  ignorePatterns: ['dist/', 'node/', 'coverage/', '*.js', '*.cjs']
}