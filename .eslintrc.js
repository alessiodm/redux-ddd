const WARN = 'warn';

module.exports = {
  root: true,
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
    'padded-blocks': 0,
    'arrow-parens': [WARN, 'as-needed'],
    'no-unused-vars': [WARN, { args: 'after-used' }],
    'no-param-reassign': 0,
    'no-class-assign': WARN,
    'no-dupe-class-members': WARN,
    'class-methods-use-this': WARN,
    'no-this-before-super': WARN,
    'no-useless-constructor': WARN,
    'constructor-super': WARN,
  },
};
