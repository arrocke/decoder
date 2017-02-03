var CRC32 = require('../../src/js/util/crc32');
var videoBuffer = require('../data/video');

describe('CRC32', function () {
  describe('constructor', function () {
    it('It initializes is properties.', function () {
      var crc32 = new CRC32({
        polynomial: 0x11111111,
        initialValue: 0x10101010,
        finalXOR: 0x01010101
      });
      expect(crc32._polynomial).toEqual(0x11111111);
      expect(crc32._initialValue).toEqual(0x10101010);
      expect(crc32._finalXOR).toEqual(0x01010101);
    });

    it('It has no required parameters.', function () {
      var crc32 = new CRC32();
      expect(crc32._polynomial).toEqual(0x04c11db7);
      expect(crc32._initialValue).toEqual(0xFFFFFFFF);
      expect(crc32._finalXOR).toEqual(0xFFFFFFFF);
    });

    it('Its polynomial must be an integer.', function () {
      expect(function () {
        new CRC32({
          polynomial: 'test'
        })
      }).toThrowError(TypeError, "The polynomial for CRC32 must be an integer");
    });

    it('Its initial value must be an integer.', function () {
      expect(function () {
        new CRC32({
          initialValue: 'test'
        })
      }).toThrowError(TypeError, "The initial value for CRC32 must be an integer");
    });

    it('Its final XOR must be an integer.', function () {
      expect(function () {
        new CRC32({
          finalXOR: 'test'
        })
      }).toThrowError(TypeError, "The final XOR for CRC32 must be an integer");
    });
  });

  describe('validate()', function () {
    var crc32, buffer, array;

    beforeEach(function () {
      crc32 = new CRC32({
        initialValue: 0,
        finalXOR: 0
      });
      buffer = videoBuffer.slice(0, 92);
      array = new Uint8Array(buffer);
    });

    it('It returns true for valid pages.', function () {
      var checksum = array[22] | array[23] << 8 | array[24] << 16 | array[25] << 24 ;
      array[22] = 0;
      array[23] = 0;
      array[24] = 0;
      array[25] = 0;
      expect(crc32.validate(buffer, checksum)).toBe(true);
    });

    it('It returns false for invalid pages.', function () {
      var checksum = array[22] << 24 | array[24] << 8 | array[25];
      array[22] = 0;
      array[23] = 0;
      array[24] = 0;
      array[25] = 0;
      expect(crc32.validate(buffer, checksum)).toBe(false);
    });
  });

  describe('calculate()', function () {
    it('It doesn\'t return 0 for random buffers.', function () {
      var buffer = new ArrayBuffer(10);
      var array = new Uint8Array(buffer);
      for (var i = 0; i < array.byteLength; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      var crc32 = new CRC32({
        finalXOR: 0,
        initialValue: 0
      });
      expect(crc32.calculate(buffer)).not.toEqual(0);
    });

    it('Running twice is an inverse operation, as it returns 0.', function () {
      var buffer = new ArrayBuffer(10);
      var array = new Uint8Array(buffer);
      for (var i = 0; i < array.byteLength; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      var crc32 = new CRC32({
        finalXOR: 0,
        initialValue: 0
      });
      var checksum = crc32.calculate(buffer);
      expect(crc32.calculate(buffer, checksum)).toEqual(0);
    });
  });
});
