const {merge} = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  // BUILD config
  mode: 'production',
  plugins: []
})
