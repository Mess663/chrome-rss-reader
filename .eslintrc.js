module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    "plugin:prettier/recommended",
    'plugin:vue/essential',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    chrome: 'readonly',
    ActiveXObject: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'vue',
    'html'
  ],
  rules: {
    // "prettier/prettier": "error",
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-new':  0,
    'func-names': 0,
    'no-use-before-define': 0
  }
};
