import BufferIterator from '../util/buffer-iterator'
import crc32 from '../util/crc32'

export default class OggDecoder extends BufferIterator {
  constructor(buffer) {
    super(buffer)
    this._pagePosition = 0
    this._physicalBitstream = []
    this._logicalBitstreams = {}
  }
  // 'OggS' in ASCII (RFC 3533 6.1)
  static get CAPTURE_PATTERN() {
    return 0x4f676753
  }
  // (RFC 3533 6.2)
  static get STREAM_STRUCTURE_VERSION() {
    return 0x00
  }
  // (RFC 3533 6.3)
  static get FRESH_PACKET() {
    return 0x01
  }
  // beginning of stream (RFC 3533 6.3)
  static get BOS() {
    return 0x02
  }
  // end of stream (RFC 3533 6.3)
  static get EOS() {
    return 0x04
  }
  get lastPage() {
    let pos = this._physicalBitstream.length - 1
    return this._physicalBitstream[pos]
  }
  getLogicalBitstream(serialNumber) {
    return this._logicalBitstreams[serialNumber]
  }
  decodePage() {
    let pagePosition = this._position

    // Decode the capture pattern. (RFC 3533 6.1)
    let capturePattern = this.getBytes(4)
    if (capturePattern != OggDecoder.CAPTURE_PATTERN) {
      throw new Error()
    }
    // Decode the stream structure version. (RFC 3533 6.2)
    let streamStructureVersion = this.getByte()

    let page = {}

    // Decode the header type falg. (RFC 3533 6.3)
    page.headerType = this.getByte()
    // Decode the granule position. (RFC 3533 6.4)
    page.granulePosition = this.getBytesAsArray(8, true)
    // Decode the bitstream serial number. (RFC 3533 6.5)
    page.bitstreamSerialNumber = this.getBytes(4, true)
    // Decode the page sequence number. (RFC 3533 6.6)
    page.pageNumber = this.getBytes(4, true)
    // Decode the CRC checksum. (RFC 3533 6.7)
    let crcChecksum = this.getBytes(4, true)
    // Decode the number of page segments. (RFC 3533 6.8)
    let pageSegmentCount = this.getByte()
    // Decode the segment table. (RFC 3533 6.9)
    page.segmentTable = this.getBytesAsArray(pageSegmentCount)
    // Find the total size of the payload.
    let payloadSize = 0
    page.segmentTable.forEach(x => payloadSize += x)
    // Find the total size of the page.
    let pageSize = payloadSize + pageSegmentCount + 27
    // Create the page view.
    page.view = this.getBytesAsDataView(payloadSize)

    // Validate checksum. Clear the checksum field before running checksum verification.
    let checksumView = new DataView(this._buffer, pagePosition, pageSize)
    checksumView.setUint32(22, 0)
    if (0 != crc32(checksumView, crcChecksum)) {
      throw new Error();
    }

    // Verify stream structure version
    if (streamStructureVersion != OggDecoder.STREAM_STRUCTURE_VERSION) {
      throw new Error()
    }

    // Find and verify bitstream
    let bitstream
    if ((page.headerType & OggDecoder.BOS) == OggDecoder.BOS) {
      if (this._logicalBitstreams[page.bitstreamSerialNumber]) {
        // If a BOS page and the stream already exists.
        throw new Error()
      }
      else if (this.lastPage && (this.lastPage.headerType & OggDecoder.BOS) == 0) {
        // If a BOS page and the last page wasn't a BOS page.
        throw new Error()
      }
      else {
        // If a BOS page and the bistream doesn't exist.
        bitstream = this._logicalBitstreams[page.bitstreamSerialNumber] = []
      }
    }
    else {
      // If not a BOS page.
      bitstream = this._logicalBitstreams[page.bitstreamSerialNumber]
      if (!bitstream) {
        // If not a BOS page but bitstream not found.
        throw new Error
      }
    }

    // Add to bitstreams
    bitstream.push(page)
    this._physicalBitstream.push(page)

    return page
  }
}
