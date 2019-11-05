const express = require('express');

const app = express();
const webpack = require('webpack');
const SseStream = require('ssestream');
const webpackConfig = require('./webpack.config');

const compiler = webpack(webpackConfig);

app.use('/sse', webpackChromeExtensionsReloadMiddleware(compiler));

function webpackChromeExtensionsReloadMiddleware(compiler, opts = {}) {
  opts.heartbeat = opts.heartbeat || 5 * 1000;

  const middleware = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');

    const sseStream = new SseStream(req); // 构造 sse 的请求
    sseStream.pipe(res);

    if (compiler.hooks) {
      compiler.hooks.done.tap(
        'webpack-chrome-extensions-reload-middleware',
        () => {
          sseStream.write({
            // 请求数据
            event: 'compiled',
            data: 'compiled'
          });
        }
      );
    }

    res.on('close', () => {
      console.log('close connection');
      sseStream.unpipe(res);
    });

    next();
  };
  return middleware;
}

app.listen(8080, () => {});
