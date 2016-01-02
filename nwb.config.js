module.exports = {
  type: 'web-module',
  babel: {
    loose: 'all'
  },
  karma: {
    tests: 'test/**/*-test.js',
    frameworks: [
      require('karma-tap')
    ]
  },
  umd: true,
  global: 'getFormData',
  jsNext: true
}
