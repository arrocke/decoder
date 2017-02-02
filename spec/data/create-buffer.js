module.exports = function (hexStr) {
  var array = new Uint8Array(hexStr.length / 2);
  for (var i = 0; i < array.byteLength; i++) {
    array[i] = parseInt(hexStr.substr(2 * i, 2), 16);
  }
  return array.buffer;
}
