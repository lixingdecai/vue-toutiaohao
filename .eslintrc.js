module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    'browser': true,
    'node': true
  },
  parserOptions: {
    'ecmaVersion': 6
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow paren-less arrow functions
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-spacing': [2, { 'before': true, 'after': true }],
    // allow async-await
    'generator-star-spacing': 0,
    'global-require': 0,
    'import/no-dynamic-require': 0,
    'no-param-reassign': ['error', { 'props': false }],
    // allow console
    'no-console': 0,
    // allow no tailling comma-dangle
    'comma-dangle': 0,
    'linebreak-style': 0,
    'prefer-template': 0,
    'no-plusplus': 0,
    'max-len': 0,
    'object-shorthand': 0,
    'no-mixed-operators': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
