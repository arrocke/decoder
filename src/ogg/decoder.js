import BufferIterator from '../util/buffer-iterator'
import Bitstream from './bitstream'

export default class OggDecoder extends BufferIterator {
  constructor(buffer) {
    super(buffer)
    this._bitstreams = []
  }
  hasBitstream(serialNumber) {

  }
  decodeHeader() {
    // 'OggS' in ASCII (RFC 3533 6.1)
    const CAPTURE_PATTERN = 0x4f676753
    // (RFC 3533 6.2)
    const STREAM_STRUCTURE_VERSION = 0x00
    // (RFC 3533 6.3)
    const FRESH_PACKET = 0x01
    const BOS = 0x02  // beginning of stream
    const EOS = 0x04  // end of stream

    let read;
    let headerType;
    let granulePosition;

    // Decode the capture pattern. (RFC 3533 6.1)
    read = super.getBytes(4)
    if (read != CAPTURE_PATTERN) {
      let position = this._position - 4
      let hexString = read.toString(16)
      throw new Error(`File not decodable. Expected 0x4f676753 at position ${position}, found 0x${hexString}.`)
    }

    // Decode the stream structure version. (RFC 3533 6.2)
    read = this.getByte()
    if (read != STREAM_STRUCTURE_VERSION) {
      let position = this._position - 1
      let hexString = read.toString(16)
      throw new Error(`File not decodable. Expected 0x00 at position ${position}, found 0x${hexString}`)
    }

    // Decode the header type falg. (RFC 3533 6.3)
    headerType = this.getByte()
    if (headerType & FRESH_PACKET == FRESH_PACKET) {

    }
    if (headerType & BOS == BOS) {

    }
    if (headerType & EOS == EOS) {

    }

    // Decode the granule position. (RFC 3533 6.4)
  }
}
