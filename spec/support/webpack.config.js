var glob = require('glob');
var path = require('path');

module.exports = {
  entry: glob.sync('./**/*.spec.js'),
  output: {
    path: path.resolve(__dirname, '../output'),
    filename: 'test.bundle.js'
  }
};
