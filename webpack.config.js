const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const webpack = require('webpack');
const os = require('os');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

const { ENV } = process.env;
const isPro = ENV === 'production';

module.exports = {
  entry: {
    index: './src/index/index.js',
    popup: './src/popup/popup.js',
    vender: ['vue', 'rss-parser'],
    hotReload: './src/hot-reload.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].[hash].js'
  },
  mode: ENV,
  devtool: isPro ? 'source-map' : 'cheap-module-eval-source-map',

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: path.resolve(__dirname, './src')
    }
  },

  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: ['happypack/loader?id=happyBabel'],
        exclude: /node_modules/
      },
      {
        // 图片格式正则
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            // 配置 url-loader 的可选项
            options: {
              // 限制 图片大小 10000B，小于限制会将图片转换为 base64格式
              limit: 10000,
              // 超出限制，创建的文件格式
              // build/images/[图片名].[hash].[图片格式]
              name: 'images/[name].[hash].[ext]'
            }
          }
        ]
      },
      {
        test: /\.less$/,
        loader: [
          'vue-style-loader',
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { sourceMap: true } }
        ]
      }
      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [path.join(__dirname, 'src')],
      //   options: {
      //     fix: true
      //   }
      // }
    ]
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index/index.html',
      chunks: ['index', 'hotReload'],
      css: ['./src/index/index.less'],
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './src/popup/popup.html',
      chunks: ['popup', 'hotReload'],
      hash: true,
      minify: {
        removeAttributeQuotes: true,
        removeComments: true,
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: 'manifest.json', toType: 'file' },
      { from: 'src/img', to: 'img', toType: 'dir' },
      { from: 'src/content.js', to: 'content.js', toType: 'file' }
    ]),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false // resolve conflict with `CopyWebpackPlugin`
    }),
    new HappyPack({
      // 用id来标识 happypack处理那里类文件
      id: 'happyBabel',
      // 如何处理  用法和loader 的配置一样
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false
                }
              ]
            ]
          }
        }
      ],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true
    }),
    // 防止chunk id的频繁改变
    new webpack.HashedModuleIdsPlugin(),
    // 打包自动缓存
    new HardSourceWebpackPlugin()
  ]
};
