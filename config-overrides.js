const webpack = require('webpack');
module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve('url'),
    url: require.resolve('url/'),
    fs: false,
    assert: require.resolve('assert'),
    assert: require.resolve('assert/'),
    process: require.resolve('process/browser'),
    os: require.resolve('os-browserify/browser'),
    util: require.resolve('util/'),
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    levenary: require.resolve('levenary'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
  };
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  );

  return config;
};
