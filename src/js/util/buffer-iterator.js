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
  this._bitPos = 0;
  this._lEndian = !!options.littleEndian; // default is false
  this._onBoundary = true;
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
});

BufferIterator.prototype.nextByte = function () {
  if (this._bitPos !== 0) {
    throw new Error('BufferIterator is off the byte boundary')
  }
  if (this._pos >= this.byteLength) {
    throw new RangeError('Offset is outside the bounds of the BufferIterator');
  }

  return this._array[this._pos++];
}

BufferIterator.prototype.nextBytes = function (n) {
  if (this._bitPos !== 0) {
    throw new Error('BufferIterator is off the byte boundary')
  }
  if (n < 1 || n > 6 || n % 1 !== 0) {
    throw new TypeError('First argument for nextBytes must be a positive integer less than 6');
  }
  if (this._pos + n > this.byteLength) {
    throw new RangeError('Offset is outside the bounds of the BufferIterator');
  }

  var val = 0;
  if (this.littleEndian) {
    for (var i = 0; i < n; i++) {
      val += Math.pow(256, i) * this._array[this._pos++];
    }
  }
  else {
    for (var i = 0; i < n; i++) {
      val *= 256;
      val += this._array[this._pos++];
    }
  }

  return val;
}

BufferIterator.prototype.nextBytesAsBufferIterator = function (n) {
  if (this._bitPos !== 0) {
    throw new Error('BufferIterator is off the byte boundary')
  }
  if (n < 1 || n % 1 !== 0) {
    throw new TypeError('First argument for nextBytesAsBufferIterator must be a positive integer');
  }
  if (this._pos + n > this.byteLength) {
    throw new RangeError('Offset is outside the bounds of the BufferIterator');
  }

  var newIterator = new BufferIterator(this._array.buffer, {
    byteOffset: this.byteOffset + this._pos,
    byteLength: n,
  });
  this._pos += n;
  return newIterator;
};

BufferIterator.prototype.nextBits = function (n) {
  if (n < 1 || n > 52 || n % 1 !== 0) {
    throw new TypeError('First argument for nextBits must be a positive integer less than 52');
  }
  if (this._pos + (this._bitPos + n) / 8 > this.byteLength) {
    throw new RangeError('Offset is outside the bounds of the BufferIterator');
  }

};

module.exports = BufferIterator;
