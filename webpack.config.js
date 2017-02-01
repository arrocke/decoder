path = require('path');

module.exports = {
  entry: './src/js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'decoder.js',
    library: 'decoder',
    libraryTarget: 'umd'
  }
};
