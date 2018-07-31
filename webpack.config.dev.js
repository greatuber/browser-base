const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

const PORT = 8080;

const output = {
  publicPath: `http://localhost:${PORT}/`,
  hotUpdateChunkFilename: 'hot/hot-update.js',
  hotUpdateMainFilename: 'hot/hot-update.json',
};

const config = Object.assign({}, baseConfig, {
  devtool: 'eval-source-map',

  plugins: [new webpack.HotModuleReplacementPlugin()],
});

config.output = Object.assign(output, baseConfig.output);

const appConfig = {
  target: 'electron-renderer',

  entry: {
    app: ['react-hot-loader/patch', './src/renderer/views/app'],
  },

  devServer: {
    contentBase: './static/pages',
    port: PORT,
    stats: {
      colors: true,
    },
    hot: true,
    inline: true,
  },
};

const testFieldConfig = {
  target: 'web',

  entry: {
    testField: ['react-hot-loader/patch', './src/renderer/views/test-field'],
  },
};

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}

module.exports = [getConfig(appConfig)];
