var BufferIterator = require('../util/buffer-iterator');
var CRC32 = require('../util/crc32');

function PageDecoder(buffer) {
  if (!(buffer instanceof ArrayBuffer)) {
    throw new TypeError('First argument to PageDecoder must be an ArrayBuffer');
  }

  this._iterator = new BufferIterator(buffer);
  this._pages = [];
  this._crc = new CRC32({
    polynomial: PageDecoder.CRC_POLYNOMIAL,
    initialValue: PageDecoder.CRC_INITIAL_VALUE,
    finalXOR: PageDecoder.CRC_FINAL_XOR
  });
}

PageDecoder.CAPTURE_CODE = 0x4f676753;
PageDecoder.STREAM_STRUCTURE_VERSION = 0x0;
PageDecoder.FRESH_PACKET = 0b00000001;
PageDecoder.BOS = 0b00000010;
PageDecoder.EOS = 0b00000100;
PageDecoder.MAX_LACING_VALUE = 255;
PageDecoder.CRC_POLYNOMIAL = 0x04C11DB7;
PageDecoder.CRC_INITIAL_VALUE = 0;
PageDecoder.CRC_FINAL_XOR = 0;
PageDecoder.HEADER_LENGTH = 27;
PageDecoder.CRC_OFFSET = 22;

Object.defineProperties(PageDecoder.prototype, {
  pages: {
    get: function () {
      return this._pages.slice();
    }
  },
  hasData: {
    get: function () {
      return this._iterator.hasBytes;
    }
  }
});

PageDecoder.prototype.nextPage = function () {
  var page = {};
  var pageOffset = this._iterator.bytePosition;

  this._iterator.littleEndian = false;

  var captureCode = this._iterator.nextBytes(4);
  if (captureCode != PageDecoder.CAPTURE_CODE) {
    throw new Error('PageDecoder cannot decode page because the capture code is invalid');
  }

  this._iterator.littleEndian = true;

  var streamStructureVersion = this._iterator.nextByte();
  if (streamStructureVersion != PageDecoder.STREAM_STRUCTURE_VERSION) {
    throw new Error('PageDecoder cannot decode page because the stream structure version is invalid');
  }

  var headerType = this._iterator.nextByte();
  page.hasFreshPacket = (headerType & PageDecoder.FRESH_PACKET) != PageDecoder.FRESH_PACKET;
  page.isBOS = (headerType & PageDecoder.BOS) === PageDecoder.BOS;
  page.isEOS = (headerType & PageDecoder.EOS) === PageDecoder.EOS;

  page.granulePosition = this._iterator.nextBytesAsBufferIterator(8);
  page.granulePosition.littleEndian = true;

  page.streamSerialNumber = this._iterator.nextBytes(4);
  page.pageNumber = this._iterator.nextBytes(4);

  var checksum = this._iterator.nextBytes(4);

  var numSegments = this._iterator.nextByte();

  page.packetStart = [];

  if (page.hasFreshPacket) {
    page.packetStart.push(0);
  }

  var payloadLength = 0;
  var packetLength = 0;
  for (var i = 0; i < numSegments; i++) {
    var segLength = this._iterator.nextByte();
    payloadLength += segLength;
    packetLength += segLength;
    if (segLength < PageDecoder.MAX_LACING_VALUE && i + 1 != numSegments) {
      page.packetStart.push(page.packetStart[page.packetStart.length - 1] + packetLength);
      packetLength = 0;
    }
  }

  var pageLength = PageDecoder.HEADER_LENGTH + numSegments + payloadLength;
  var crcBuffer = this._iterator.buffer.slice(pageOffset, pageOffset + pageLength);
  var crcArray = new Uint8Array(crcBuffer);
  crcArray[PageDecoder.CRC_OFFSET + 0] = 0;
  crcArray[PageDecoder.CRC_OFFSET + 1] = 0;
  crcArray[PageDecoder.CRC_OFFSET + 2] = 0;
  crcArray[PageDecoder.CRC_OFFSET + 3] = 0;

  if (!this._crc.validate(crcBuffer, checksum)) {
    throw new Error('PageDecoder cannot decode page because its checksum is invalid');
  }

  page.payload = this._iterator.nextBytesAsBufferIterator(payloadLength);

  this._pages.push(page);

  return page;
};

module.exports = PageDecoder;
