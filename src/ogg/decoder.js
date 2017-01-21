import BufferIterator from '../util/buffer-iterator'
import Bitstream from './bitstream'
import OggPage from './page'

export default class OggDecoder extends BufferIterator {
  constructor(buffer) {
    super(buffer)
    this._pagePosition = 0
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
  decodePage() {
    // Set the current page postion for error reporting.
    this._pagePosition = this._position

    // Decode the capture pattern. (RFC 3533 6.1)
    let capturePattern = this.getBytes(4)
    if (capturePattern != OggDecoder.CAPTURE_PATTERN) {
      throw new Error()
    }

    // Decode the stream structure version. (RFC 3533 6.2)
    let streamStructureVersion = this.getByte()
    if (streamStructureVersion != OggDecoder.STREAM_STRUCTURE_VERSION) {
      throw new Error()
    }

    // Decode the header type falg. (RFC 3533 6.3)
    let headerType = this.getByte()

    // Decode the granule position. (RFC 3533 6.4)
    let granulePosition = this.getBytesAsArray(8)

    // Decode the bitstream serial number. (RFC 3533 6.5)
    let bitstreamSerialNumber = this.getBytes(4)

    // Decode the page sequence number. (RFC 3533 6.6)
    let pageNumber = this.getBytes(4)

    // Decode the CRC checksum. (RFC 3533 6.7)
    let crcChecksum = this.getBytes(4)

    // Decode the number of page segments. (RFC 3533 6.8)
    let pageSegmentCount = this.getByte()

    // Decode the segment table. (RFC 3533 6.9)
    let segmentTable = this.getBytesAsArray(pageSegmentCount)

    // Find the total size of the payload
    let payloadSize = 0
    segmentTable.forEach(x => payloadSize += x)

    // Create the page view.
    let pageView = this.getBytesAsDataView(payloadSize)

    return new OggPage({
      headerType: headerType,
      granulePosition: granulePosition,
      bitstreamSerialNumber: bitstreamSerialNumber,
      pageSequenceNumber: pageNumber,
      segmentTable: segmentTable,
      view: pageView
    })
  }
}
