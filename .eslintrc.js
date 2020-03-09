module.exports = {
  extends: [
      'alloy',
      'alloy/vue',
  ],
  env: {
      browser: true
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    chrome: 'readonly',
    ActiveXObject: 'readonly',
    ENV: 'readonly'
  },
  rules: {
    'generator-star-spacing': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-new':  0,
    'func-names': 0,
    'no-use-before-define': 0,
    semi: 'error'
  }
};
