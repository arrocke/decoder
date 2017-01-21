import BufferIterator from '../util/buffer-iterator'
import Bitstream from './bitstream'

export default class OggDecoder extends BufferIterator {
  constructor(buffer) {
    super(buffer)
    this._bitstreams = {}
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
  decode() {
    while (this.hasBytes) {
      this._decodePage()
    }

    let bitstreams = []
    Object.keys(this._bitstreams).forEach(key => bitstreams.push(this._bitstreams[key]))
    return bitstreams
  }
  _initBitstream(headerType, serialNumber) {
    // Create or find the bitstream for the page.
    let bitstream = this._bitstreams[serialNumber]

    // If bitstream has not been initialized...
    if (!bitstream) {
      // ...and this page is marked as BOS...
      if ((headerType & OggDecoder.BOS) == OggDecoder.BOS) {
        // ...create and add the bitsream to the list...
        bitstream = new Bitstream()
        this._bitstreams[serialNumber] = bitstream
      }
      else {
        // ...otherwise the BOS page is missing.
        throw new Error(`A page was found at position ${this._pagePosition}, for bitstream ${serialNumber} before a BOS page.`)
      }
    }
    // If the bitstream has been initialized, another BOS page is invalid.
    else if ((headerType & OggDecoder.BOS) == OggDecoder.BOS) {
      throw new Error(`A second BOS page for bitstream ${serialNumber} found at position ${this._pagePosition}. A bistream can only have one BOS page.`)
    }

    return bitstream
  }
  _decodePage() {
    this._pagePosition = this._position

    // Decode the capture pattern. (RFC 3533 6.1)
    let capturePattern = this.getBytes(4)

    // Decode the stream structure version. (RFC 3533 6.2)
    let streamStructureVersion = this.getByte()

    // Decode the header type falg. (RFC 3533 6.3)
    let headerType = this.getByte()

    // Decode the granule position. (RFC 3533 6.4)
    let granulePosition = this.getBytesAsArray(8)

    // Decode the bitstream serial number. (RFC 3533 6.5)
    let bitstreamSerialNumber = this.getBytes(4)

    // Find or create the bitstream for the page.
    let bitstream = this._initBitstream(headerType, bitstreamSerialNumber)

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

    // Create the page buffer.
    let pageBuffer = this.getBytesAsBuffer(payloadSize)
  }
}
