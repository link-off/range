const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  devtool: 'inline-source-map',
  
  devServer: {
    open: true,
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8088,
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
});
