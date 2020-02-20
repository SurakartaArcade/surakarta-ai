module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jsdoc/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    indent: ["error", 4]
  }
}
