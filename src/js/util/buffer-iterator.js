function BufferIterator(view, littleEndian) {
  if (!(view instanceof DataView)) {
    throw new Error('BufferIterator must be initialized with a DataView.');
  }

  this._view = view;
  this._pos = 0;
  this._lEndian = !!littleEndian; // default is false
};

Object.defineProperties(BufferIterator.prototype, {
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
