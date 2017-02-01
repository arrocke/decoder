var BufferIterator = require('../../src/js/util/buffer-iterator.js');

describe('BufferIterator', function () {
  it('It should initialize its properties.', function () {
    var buffer = new ArrayBuffer(10);
    var view = new DataView(buffer);
    var iterator = new BufferIterator(view, true);
    expect(iterator._view).toBe(view);
    expect(iterator._pos).toEqual(0);
    expect(iterator._lEndian).toBe(true);
  });

  it('It should require a DataView.', function () {
    expect(function () {
      new BufferIterator();
    }).toThrowError('BufferIterator must be initialized with a DataView.');
  });

  it('It should not require littleEndian flag.', function () {
    var buffer = new ArrayBuffer(10);
    var view = new DataView(buffer);
    var iterator;
    expect(function () {
      iterator = new BufferIterator(view);
    }).not.toThrowError();
    expect(iterator._lEndian).toBe(false);
  });

  describe('setLittleEndian', function () {
    var buffer, view, iterator;

    beforeEach(function () {
      buffer = new ArrayBuffer(10);
      view = new DataView(buffer);
      iterator = new BufferIterator(view);
    });

    it('It should return its private variable', function () {
      iterator._lEndian = false;
      expect(iterator.littleEndian).toBe(false);
      iterator._lEndian = true;
      expect(iterator.littleEndian).toBe(true);
    });

    it('It should be able to be changed to false.', function () {
      iterator._lEndian = true;
      iterator.littleEndian = false;
      expect(iterator._lEndian).toBe(false);
    })

    it('It should be able to be changed to true.', function () {
      iterator._lEndian = false;
      iterator.littleEndian = true;
      expect(iterator._lEndian).toBe(true);
    })
  });
});
