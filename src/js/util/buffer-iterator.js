function BufferIterator(buffer, options) {
  if (!(buffer instanceof ArrayBuffer)) {
    throw new TypeError('First argument to BufferIterator must be an ArrayBuffer');
  }

  options = options || {};

  // Setup the TypedArray for accessing the binary data.
  // Default offset is 0.
  // Default length is the length from the offset to the end of the buffer.
  var offset = options.byteOffset || 0;
  var length = options.byteLength || (buffer.byteLength - offset);

  if (offset + length > buffer.byteLength) {
    throw new RangeError('Invalid BufferIterator length');
  }
  this._array = new Uint8Array(buffer, offset, length);

  this._pos = 0;
  this._lEndian = !!options.littleEndian; // default is false
};

Object.defineProperties(BufferIterator.prototype, {
  byteLength: {
    get: function () {
      return this._array.byteLength;
    }
  },
  byteOffset: {
    get: function () {
      return this._array.byteOffset;
    }
  },
  hasBytes: {
    get: function () {
      return this._pos < this.byteLength;
    }
  },
  littleEndian: {
    get: function () {
      return this._lEndian;
    },
    set: function (val) {
      this._lEndian = !!val;
    }
  }
})

module.exports = BufferIterator;
