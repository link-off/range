const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, '../src'),
  index: path.join(__dirname, '../src/index.ts'),
  slider: path.join(__dirname, '../src/slider.ts'),
  scrollBar: path.join(__dirname, '../src/scroll-bar.ts'),
  dist: path.join(__dirname, '../dist'),
  assets: 'assets/'
}
const PAGES_DIR = `${PATHS.src}/pug/pages`
const PAGES = fs.readdirSync(PAGES_DIR);

module.exports = {
  externals: {
    paths: PATHS
  },
  entry: {
    index: PATHS.index,
    slider: PATHS.slider,
    scrollBar: PATHS.scrollBar
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader'
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              postcssOptions: {
                config: `./postcss.config.js`,
              }
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true, postcssOptions: {
                config: `./postcss.config.js`,
              }
            }
          }
        ]
      }]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '~': PATHS.src
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
        { from: `${PATHS.src}/static`, to: '' },
      ]
    }),
    ...PAGES.map(page => {
      let template;
      let chunks = ['vendors'];
      let filename;

      if (page.match(/\.pug/g)) {
        template = `${PAGES_DIR}/${page}`;
        filename = `./${page.replace(/\.pug/, '.html')}`;
      } else {
        template = `${PAGES_DIR}/${page}/${page}.pug`;
        filename = `./${page}.html`;
      }

      switch (page.replace(/\.pug/, '')) {
        case 'slider': chunks.push(['slider']); break;
        case 'scroll-bar': chunks.push('scroll-bar'); break;
        default: chunks.push('index');
      }

      return new HtmlWebpackPlugin({
        template,
        chunks,
        filename
      });
    })
  ],
}
