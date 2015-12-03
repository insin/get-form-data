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
  // UMD build config
  umd: true,
  global: 'getFormData'
}
