var glob = require('glob');

module.exports = {
  entry: glob.sync('./test/**/*.mocha.js'),
  output: {
    path: __dirname + '/dist',
    filename: 'tests.js',
  },
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
