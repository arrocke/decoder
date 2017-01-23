var glob = require('glob');
const WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
  entry: glob.sync('./test/**/*.mocha.js'),
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: 'tests.js',
  },
  plugins: [
    new WebpackShellPlugin({
      onBuildEnd: [
        'npm run test'
      ],
      dev: false
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  }
};
