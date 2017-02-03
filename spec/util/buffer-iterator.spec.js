var BufferIterator = require('../../src/js/util/buffer-iterator.js');

describe('BufferIterator', function () {
  describe('constructor', function () {
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
      expect(iterator._bitPos).toEqual(0);
      expect(iterator._lEndian).toBe(true);
      expect(iterator._onBoundary).toBe(true);
    });

    it('It should require an ArrayBuffer.', function () {
      expect(function () {
        new BufferIterator();
      }).toThrowError(TypeError, 'First argument to BufferIterator must be an ArrayBuffer');
    });

    it('It can have a byteLength of 0.', function () {
      var buffer = new ArrayBuffer(10);
      var iterator;
      expect(function () {
        iterator = new BufferIterator(buffer, {
          byteLength: 0
        });
      }).not.toThrowError();
      expect(iterator._array.byteLength).toEqual(0);
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
      }).toThrowError(RangeError, 'Invalid BufferIterator length');
    });
  });

  describe('properties', function () {
    var buffer, iterator;

    beforeEach(function () {
      buffer = new ArrayBuffer(10);
    });

    describe('setLittleEndian', function () {
      beforeEach(function () {
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
      it('It should return the offset of the TypedArray inside the iterator.', function () {
        var iterator = new BufferIterator(buffer);
        expect(iterator.byteOffset).toEqual(0);

        iterator = new BufferIterator(buffer, {
          byteOffset: 5
        });
        expect(iterator.byteOffset).toEqual(5);
      });
    });

    describe('bytePosition', function () {
      it('It should return the byte position relative to the ArrayBuffer inside the iterator.', function () {
        iterator = new BufferIterator(buffer, {
          byteOffset: 5
        });
        iterator._pos = 2;
        expect(iterator.bytePosition).toEqual(7);
      });
    });

    describe('hasBytes', function () {
      beforeAll(function () {
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
  });

  describe('methods', function () {
    var buffer, array, iterator;

    beforeEach(function () {
      buffer = new ArrayBuffer(10);
      array = new Uint8Array(buffer);
      for (var i = 0; i < array.byteLength; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      iterator = new BufferIterator(buffer);
    });

    describe('nextByte()', function () {
      it('It returns the correct value of the byte.', function () {
        iterator._pos = 1;
        expect(iterator.nextByte()).toEqual(array[1]);
      });

      it('It increments the position of the iterator.', function () {
        iterator._pos = 1;
        iterator.nextByte();
        expect(iterator._pos).toEqual(2);
      });

      it('It cannot read past the end of the buffer.', function () {
        iterator._pos = 10;
        expect(function () {
          iterator.nextByte();
        }).toThrowError(RangeError, 'Offset is outside the bounds of the BufferIterator');
      });

      it('It cannot read a byte when the position is off the byte boundary.', function () {
        iterator._pos = 1;
        iterator._bitPos = 1;
        expect(function () {
          iterator.nextByte();
        }).toThrowError('BufferIterator is off the byte boundary');
      });
    });

    describe('nextBytes()', function () {
      it('It returns 0 if zero bytes are requested.', function () {
        expect(iterator.nextBytes(0)).toEqual(0);
      });

      it('It returns the correct value of the bytes.', function () {
        iterator._pos = 1;
        iterator._lEndian = false;
        expect(iterator.nextBytes(2)).toEqual(array[1] * 256 + array[2]);
      });

      it('It returns the correct value of the bytes if the little endian flag is set.', function () {
        iterator._pos = 1;
        iterator._lEndian = true;
        expect(iterator.nextBytes(2)).toEqual(array[2] * 256 + array[1]);
      });

      it('It increments the position of the iterator.', function () {
        iterator._pos = 1;
        iterator.nextBytes(2);
        expect(iterator._pos).toEqual(3);
      });

      it('It can only read whole number amounts of bytes.', function () {
        iterator._pos = 1;
        expect(function () {
          iterator.nextBytes('test')
        }).toThrowError(TypeError, 'First argument for nextBytes must be a positive integer less than 6');
      });

      it('It cannot safely read more than 6 bytes, as that is the maximum safe size of an integer.', function () {
        iterator._pos = 1;
        expect(function () {
          iterator.nextBytes(7)
        }).toThrowError(TypeError, 'First argument for nextBytes must be a positive integer less than 6');
      });

      it('It cannot read past the end of the buffer.', function () {
        iterator._pos = 8;
        expect(function () {
          iterator.nextBytes(3);
        }).toThrowError(RangeError, 'Offset is outside the bounds of the BufferIterator');
      });

      it('It cannot read a byte when the position is off the byte boundary.', function () {
        iterator._pos = 1;
        iterator._bitPos = 1;
        expect(function () {
          iterator.nextBytes(2);
        }).toThrowError('BufferIterator is off the byte boundary');
      });
    });

    describe('nextBytesAsBufferIterator()', function () {
      it('It returns an empty BufferIterator if the 0 bytes are requested.', function () {
        iterator._pos = 1;
        var newIterator = iterator.nextBytesAsBufferIterator(0);
        expect(newIterator._array.buffer).toBe(iterator._array.buffer);
        expect(newIterator.byteOffset).toEqual(1);
        expect(newIterator.byteLength).toEqual(0);
        expect(newIterator.littleEndian).toBe(false);
      });

      it('It returns a BufferIterator with the correct byteOffset and byteLength', function () {
        iterator._pos = 1;
        var newIterator = iterator.nextBytesAsBufferIterator(8);
        expect(newIterator._array.buffer).toBe(iterator._array.buffer);
        expect(newIterator.byteOffset).toEqual(1);
        expect(newIterator.byteLength).toEqual(8);
        expect(newIterator.littleEndian).toBe(false);
      });

      it('It increments the position of the iterator.', function () {
        iterator._pos = 1;
        iterator.nextBytesAsBufferIterator(8);
        expect(iterator._pos).toEqual(9);
      });

      it('It can only read whole number amounts of bytes.', function () {
        iterator._pos = 1;
        expect(function () {
          iterator.nextBytesAsBufferIterator('test')
        }).toThrowError(TypeError, 'First argument for nextBytesAsBufferIterator must be a positive integer');
      });

      it('It cannot read past the end of the buffer.', function () {
        iterator._pos = 8;
        expect(function () {
          iterator.nextBytesAsBufferIterator(3);
        }).toThrowError(RangeError, 'Offset is outside the bounds of the BufferIterator');
      });

      it('It cannot read a byte when the position is off the byte boundary.', function () {
        iterator._pos = 1;
        iterator._bitPos = 1;
        expect(function () {
          iterator.nextBytesAsBufferIterator(2);
        }).toThrowError('BufferIterator is off the byte boundary');
      });
    });

    describe('nextBits()', function () {
      it('It returns 0 if zero bits are requested.', function () {
        expect(iterator.nextBits(0)).toEqual(0);
      });

      it ('It returns the correct value of the bits', function () {
        array[0] = 0b10101010;
        array[1] = 0b01010101;
        array[2] = 0b11001100;
        array[3] = 0b00110011;
        expect(iterator.nextBits(5)).toEqual(0b10101);
        expect(iterator.nextBits(5)).toEqual(0b01001);
        expect(iterator.nextBits(17)).toEqual(0b01010111001100001);
        expect(iterator.nextBits(5)).toEqual(0b10011);
      });

      it('It increments the position of the iterator.', function () {
        iterator._pos = 1;
        iterator._bitPos = 0;
        iterator.nextBits(3);
        expect(iterator._pos).toEqual(1);
        expect(iterator._bitPos).toEqual(3);
        iterator.nextBits(9);
        expect(iterator._pos).toEqual(2);
        expect(iterator._bitPos).toEqual(4);
      });

      it('It can only read whole number amounts of bits.', function () {
        iterator._pos = 1;
        expect(function () {
          iterator.nextBits('test')
        }).toThrowError(TypeError, 'First argument for nextBits must be a positive integer less than 52');
      });

      it('It cannot safely read more than 52 bits, as that is the maximum safe size of an integer.', function () {
        iterator._pos = 1;
        expect(function () {
          iterator.nextBits(53)
        }).toThrowError(TypeError, 'First argument for nextBits must be a positive integer less than 52');
      });

      it('It cannot read past the end of the buffer.', function () {
        iterator._pos = 9;
        expect(function () {
          iterator.nextBits(9);
        }).toThrowError(RangeError, 'Offset is outside the bounds of the BufferIterator');
      });
    });
  });
});
