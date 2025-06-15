module.exports = {
  extends: ['airbnb', 'prettier', 'plugin:node/recommended'],
  plugins: ['node', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-param-reassign': 'off',
    'prefer-regex-literals': 'off',
    'no-undef': 'off',
    'no-console:': 'off',
  },
};
