module.exports = {
  type: 'web-module',
  karma: {
    frameworks: [
      require('karma-tap')
    ]
  },
  npm: {
    umd: 'getFormData'
  }
}
