var PageDecoder = require('../../src/js/ogg/page-decoder');
var BufferIterator = require('../../src/js/util/buffer-iterator');
var videoBuffer = require('../data/video');

describe('PageDecoder', function () {
  describe('constructor', function () {
    it('It initializes its properties.', function () {
      var buffer = new ArrayBuffer(10);
      var decoder = new PageDecoder(buffer);
      expect(decoder._iterator.byteLength).toEqual(10);
      expect(decoder._iterator.byteOffset).toEqual(0);
      expect(decoder._iterator._array.buffer).toBe(buffer);
      expect(decoder._pages).toEqual([]);
    });

    it('It requires an ArrayBuffer.', function () {
      expect(function () {
        new PageDecoder();
      }).toThrowError(TypeError, 'First argument to PageDecoder must be an ArrayBuffer');
    });
  });

  describe('properties', function () {
    var buffer, decoder;

    beforeEach(function () {
      buffer = new ArrayBuffer(10);
      decoder = new PageDecoder(buffer);
    });

    describe('pages', function () {
      beforeEach(function () {
        decoder._pages.push({}, {});
      });

      it('It returns an array of decoded pages.', function () {
        expect(decoder.pages).toEqual([{}, {}]);
      });

      it('It returns a copy of the internal array.', function () {
        expect(decoder.pages).not.toBe(decoder._pages);
      });
    });

    describe('hasData', function () {
      it('It returns true if the iterator has not reached the end of the buffer.', function () {
        decoder._iterator._pos = 0;
        expect(decoder.hasData).toBe(true);
      });

      it('It returns false if the iterator has reached the end of the buffer.', function () {
        decoder._iterator._pos = 10;
        expect(decoder.hasData).toBe(false);
      });
    });
  });

  describe('methods', function () {
    var buffer, array, decoder;

    beforeEach(function () {
      buffer = videoBuffer.slice();
      array = new Uint8Array(buffer);
      decoder = new PageDecoder(buffer);
    });

    describe('nextPage()', function () {
      var buffer, array, decoder;

      describe('for valid pages', function () {
        var pages;

        beforeAll(function () {
          buffer = videoBuffer.slice();
          array = new Uint8Array(buffer);
          decoder = new PageDecoder(buffer);
          pages = [];
          // Byte offsets for first few pages:
          // 0, 92, 162, 220, 409, 3776, 7727
          while (decoder.hasData) {
            pages.push(decoder.nextPage());
          }
        });

        it('It returns if the page contains a fresh packet.', function () {
          expect(pages[0].hasFreshPacket).toEqual(true);
        });

        it('It returns if the page is the beginning of a stream.', function () {
          expect(pages[0].isBOS).toEqual(true);
        });

        it('It returns if the page is the end of a stream.', function () {
          expect(pages[0].isEOS).toEqual(false);
        });

        it('It returns the granule position.', function () {
          expect(pages[0].granulePosition).toEqual(jasmine.any(BufferIterator));
          expect(pages[0].granulePosition.byteOffset).toEqual(6);
          expect(pages[0].granulePosition.byteLength).toEqual(8);
          expect(pages[0].granulePosition.littleEndian).toBe(true);
        });

        it('It returns the stream serial number.', function () {
          expect(pages[0].streamSerialNumber).toEqual(0x5f81bc80);
        });

        it('It returns the page sequence number.', function () {
          expect(pages[0].pageNumber).toEqual(0);
        });

        it('It returns the offset of each packet relative to the start of the payload.', function () {
          expect(pages[0].packetStart.length).toEqual(1);
          expect(pages[0].packetStart[0]).toEqual(0);
        });

        it('It returns a BufferIterator of the page payload.', function () {
          expect(pages[0].payload).toEqual(jasmine.any(BufferIterator));
          expect(pages[0].payload.byteOffset).toEqual(28);
          expect(pages[0].payload.byteLength).toEqual(0x40);
          expect(pages[0].payload.littleEndian).toBe(false);
        });
      });

      describe('for invalid pages', function () {

        beforeEach(function () {
          buffer = videoBuffer.slice();
          array = new Uint8Array(buffer);
          decoder = new PageDecoder(buffer);
        });

        it('It cannot decode a page with an invalid capture code.', function () {
          array[0] = 0;
          expect(function () {
            decoder.nextPage();
          }).toThrowError('PageDecoder cannot decode page because the capture code is invalid')
        });

        it('It cannot decode a page with an invalid stream structure version.', function () {
          array[4] = 1;
          expect(function () {
            decoder.nextPage();
          }).toThrowError('PageDecoder cannot decode page because the stream structure version is invalid')
        });

        xit('It cannot decode a page with an invalid checksum.', function () {
          array[22] = 0;
          expect(function () {
            decoder.nextPage();
          }).toThrowError('PageDecoder cannot decode page because the checksum is invalid.');
        });
      });
    });
  });
});
