module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'prettier'
  ],
  overrides: [{
    files: ['*.jsx', '*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['off'],
    },
  }],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-key': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    '@typescript-eslint/triple-slash-reference': 'off'
  },
}
