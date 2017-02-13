const WARN = 'warn';

module.exports = {
  extends: 'airbnb',
  env: {
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    'ecmaVersion': 6,
    'sourceType': 'module',
  },
  rules: {
    // Classes
    'no-class-assign': WARN,
    'no-dupe-class-members': WARN,
    'class-methods-use-this': WARN,
    'no-this-before-super': WARN,
    'no-useless-constructor': WARN,
    'constructor-super': WARN,
  },
};
