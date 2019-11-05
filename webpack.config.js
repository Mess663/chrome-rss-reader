const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const os = require('os');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    index: './src/index/index.js',
    popup: './src/popup/popup.js',
    hotReload: './src/hot-reload.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'js/[name].bundle.js'
  },
  mode: 'development',
  devtool: 'source-map',

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      src: path.resolve(__dirname, './src')
    }
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
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
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.js$/,
        // 把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happyBabel',
        // 排除node_modules 目录下的文件
        exclude: /node_modules/
      },
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(__dirname, 'src')],
        options: {
          fix: true
        }
      }
    ]
  },

  // optimization: {
  //   minimize: true,
  //   minimizer: [new TerserPlugin({
  //     terserOptions: {
  //       compress: {
  //         // drop_console: true,
  //       },
  //     },
  //   })],
  //   // splitChunks: {
  //   //   chunks: 'all',
  //   // },
  // },

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
      },
      meta: {
        'Content-Security-Policy':
          "script-src 'self' 'unsafe-eval'; object-src 'self'"
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
      { from: 'src/img', to: 'img', toType: 'dir' }
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
          loader: 'babel-loader?cacheDirectory=true'
        }
      ],
      // 共享进程池
      threadPool: happyThreadPool,
      // 允许 HappyPack 输出日志
      verbose: true
    })

    // new webpack.HotModuleReplacementPlugin(),

    // new BundleAnalyzerPlugin()
    // new WxMultiEntryPlugin()
  ],

  devServer: {
    contentBase: './dist',
    hot: true
  }
};
