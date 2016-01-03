'use strict';

const winston = require('winston');
const webpack = require('webpack');
const express = require('express');
const path = require('path');

function createRouter(options) {
  const router = new express.Router();
  const distPath = options.distPath || 'dist';
  const indexFileName = options.indexFileName || 'indexPath';
  const webpackConfig = options.webpackConfig;

  if (!webpackConfig) {
    throw new Error('options.webpackConfig is required');
  }

  if (process.env.NODE_ENV === 'production') {
    // In production, assets are bundled at build time and served statically from
    // the 'dist' folder. This is more efficient.
    winston.info('Prod mode: serving client static assets.');
    router.use(express.static(distPath));
    router.get('*', (req, res) => res.sendFile(path.join(distPath, indexFileName)));
  } else {
    // In development, assets are bundled and hot-loaded on the fly. This is
    // resource intensive, but allows auto-rebuilding of client and server code
    // for developer convenience.
    winston.info('Dev mode: serving client from webpack... Please wait.');

    const compiler = webpack(webpackConfig);
    const devMiddleware = require('webpack-dev-middleware')(compiler, {
      publicPath: webpackConfig.output.publicPath,
      stats: {
        colors: true
      }
    });

    router.use(devMiddleware);
    router.use(require('webpack-hot-middleware')(compiler));
    router.get('*', (req, res) => res.end(
      devMiddleware.fileSystem.readFileSync(
        path.join(webpackConfig.output.path, indexFileName))));
  }

  return router;
}

module.exports = createRouter;
