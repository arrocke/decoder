import BufferIterator from '../util/buffer-iterator'

export default class OggDecoder extends BufferIterator {
  decodeHeader() {
    // 'OggS' in ASCII (RFC 3533 6.1)
    const CAPTURE_PATTERN = 0x4f676753
    // (RFC 3533 6.2)
    const STREAM_STRUCTURE_VERSION = 0x00
    let read;

    // Decode the capture pattern. (RFC 3533 6.1)
    read = super.getBytes(4)
    if (read != CAPTURE_PATTERN) {
      let position = this._position - 4
      let hexString = read.toString(16)
      throw new Error(`File not decodable. Expected 0x4f676753 at position ${position}, found 0x${hexString}.`)
    }

    // Decode the stream structure version. (RFC 3533 6.2)
    read = this.getByte();
    if (read != STREAM_STRUCTURE_VERSION) {
      let position = this._position - 1;
      let hexString = read.toString(16);
      throw new Error(`File not decodable. Expected 0x00 at position ${position}, found 0x${hexString}`)
    }
  }
}
