const webpack = require('webpack');
const baseConfig = require('./webpack.config.base');

const config = Object.assign({}, baseConfig, {
  devtool: 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});

const appConfig = {
  target: 'electron-renderer',

  entry: {
    app: ['./src/app'],
  },
};

const newTabConfig = {
  target: 'web',

  entry: {
    newtab: ['./src/newtab'],
  },
};

const testFieldConfig = {
  target: 'web',

  entry: {
    testField: ['./src/test-field'],
  },
};

function getConfig(cfg) {
  return Object.assign({}, config, cfg);
}

module.exports = [
  getConfig(appConfig),
  getConfig(newTabConfig),
  getConfig(testFieldConfig),
];
