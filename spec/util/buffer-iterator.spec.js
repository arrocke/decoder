var BufferIterator = require('../../src/js/util/buffer-iterator.js');

describe('BufferIterator', function () {
  it('It should initialize its properties.', function () {
    var buffer = new ArrayBuffer(10);
    var iterator = new BufferIterator(buffer, {
      byteOffset: 1,
      byteLength: 5,
      littleEndian: true
    });
    expect(iterator._array.buffer).toBe(buffer);
    expect(iterator._array.byteLength).toEqual(5);
    expect(iterator._array.byteOffset).toEqual(1);
    expect(iterator._pos).toEqual(0);
    expect(iterator._lEndian).toBe(true);
  });

  it('It should require an ArrayBuffer.', function () {
    expect(function () {
      new BufferIterator();
    }).toThrowError('First argument to BufferIterator must be an ArrayBuffer');
  });

  it('It should not require any of the options.', function () {
    var buffer = new ArrayBuffer(10);
    var iterator;
    expect(function () {
      iterator = new BufferIterator(buffer);
    }).not.toThrowError();
    expect(iterator._lEndian).toBe(false);
    expect(iterator._array.byteLength).toEqual(10);
    expect(iterator._array.byteOffset).toEqual(0);
  });

  it('It should not allow offset and length combinations that go past the buffer.', function () {
    var buffer = new ArrayBuffer(2);
    expect(function () {
      new BufferIterator(buffer, {
        byteLength: 3,
        byteOffset: 1
      });
    }).toThrowError('Invalid BufferIterator length');
  });

  describe('setLittleEndian', function () {
    var buffer, iterator;

    beforeAll(function () {
      buffer = new ArrayBuffer(10);
      iterator = new BufferIterator(buffer);
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

  describe('byteLength', function () {
    var buffer;

    beforeAll(function () {
      buffer = new ArrayBuffer(10);
    });

    it('It should return the length of the TypedArray inside the iterator.', function () {
      var iterator = new BufferIterator(buffer);
      expect(iterator.byteLength).toEqual(10);

      iterator = new BufferIterator(buffer, {
        byteLength: 5
      });
      expect(iterator.byteLength).toEqual(5);
    });
  });

  describe('byteOffset', function () {
    var buffer;

    beforeAll(function () {
      buffer = new ArrayBuffer(10);
    });

    it('It should return the offset of the TypedArray inside the iterator.', function () {
      var iterator = new BufferIterator(buffer);
      expect(iterator.byteOffset).toEqual(0);

      iterator = new BufferIterator(buffer, {
        byteOffset: 5
      });
      expect(iterator.byteOffset).toEqual(5);
    });
  });

  describe('hasBytes', function () {
    var buffer, iterator;

    beforeAll(function () {
      buffer = new ArrayBuffer(10);
      iterator = new BufferIterator(buffer);
    });

    it('It should return true if the iterator has not reached the end of the buffer.', function () {
      iterator._pos = 1;
      expect(iterator.hasBytes).toBe(true);
    });

    it('It should return false if the iterator has reached the end of the buffer.', function () {
      iterator._pos = 10;
      expect(iterator.hasBytes).toBe(false);
    });
  });

  describe('nextByte()', function () {
    
  })
});
