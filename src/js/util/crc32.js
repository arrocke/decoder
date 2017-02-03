function CRC32(options) {
  options = options || {};

  this._polynomial = CRC32.DEFAULT_POLYNOMIAL;
  if (options.polynomial != undefined) {
    this._polynomial = options.polynomial;
  }
  this._initialValue = CRC32.DEFAULT_INITIAL_VALUE;
  if (options.initialValue != undefined) {
    this._initialValue = options.initialValue;
  }
  this._finalXOR = CRC32.DEFAULT_FINAL_XOR;
  if (options.finalXOR != undefined) {
    this._finalXOR = options.finalXOR;
  }

  if (typeof this._polynomial != 'number' || this._polynomial % 1 != 0) {
    throw new TypeError('The polynomial for CRC32 must be an integer');
  }
  if (typeof this._initialValue != 'number' || this._initialValue % 1 != 0) {
    throw new TypeError('The initial value for CRC32 must be an integer');
  }
  if (typeof this._finalXOR != 'number' || this._finalXOR % 1 != 0) {
    throw new TypeError('The final XOR for CRC32 must be an integer');
  }
}

CRC32.DEFAULT_POLYNOMIAL = 0x04C11DB7;
CRC32.DEFAULT_INITIAL_VALUE = 0xFFFFFFFF;
CRC32.DEFAULT_FINAL_XOR = 0xFFFFFFFF;

CRC32.prototype.calculate = function (buffer, checksum) {
  checksum = checksum || 0;
  var array = new Uint8Array(buffer);
  var augBuffer = new ArrayBuffer(buffer.byteLength + 4);
  var augArray = new Uint8Array(augBuffer);
  for (var i = 0; i < buffer.byteLength; i++) {
    augArray[i] = array[i];
  }
  augArray[array.byteLength + 0] = checksum >>> 24;
  augArray[array.byteLength + 1] = checksum >>> 16;
  augArray[array.byteLength + 2] = checksum >>> 8;
  augArray[array.byteLength + 3] = checksum;

  var register = this._initialValue;
  var byteCount = augArray.byteLength;
  for (var i = 0; i < byteCount; i++) {
    var byte = augArray[i];
    for (var j = 0; j < 8; j++) {
      register = (register << 1 | byte >>> 7 - j & 1) ^ this._polynomial * (register >>> 31);
    }
  }
  register ^= this._finalXOR;
  return (register >>> 1) * 2 + (register & 1);
};

CRC32.prototype.validate = function (buffer, checksum) {
  return !this.calculate(buffer, checksum);
}

module.exports = CRC32;
