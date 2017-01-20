import FileBuffer from '../util/file-buffer'

export default class OggDecoder extends FileBuffer {
  constructor(buffer) {
    super(buffer)
    this._position = 0
  }
  readByte() {
    let byte = super.getByte(this._position)
    if (byte != null) {
      this._position++
    }
    return byte
  }
  readBytes(length) {
    let bytes = super.getBytes(this._position, length)
    this._position += bytes.length
    return bytes
  }
  decodeHeader() {
    // 'OggS' in ASCII (RFC 3533 6.1)
    const CAPTURE_PATTERN = [0x4f, 0x67, 0x67, 0x53]
    const STREAM_STRUCTURE_VERSION = 0x00
    let bytes;
    let header = {}

    // Decode the capture pattern. (RFC 3533 6.1)
    bytes = this.readBytes(4)
    for (let i = 0; i < CAPTURE_PATTERN.length; i++) {
      if (bytes[i] != CAPTURE_PATTERN[i]) {
        let position = this._position - bytes.length
        let hexString = bytes
          .map(x => x.toString(16))
          .join('')
        throw new Error(`File not decodable. Expected 0x4f676753 at position ${position}, found 0x${hexString}.`)
      }
    }
    header.capturePattern = bytes;

    // Decode the stream structure version. (RFC 3533 6.2)
    bytes = this.readByte();
    if (bytes != STREAM_STRUCTURE_VERSION) {
      let position = this._position - bytes == null ? 0 : 1;
      let hexString = bytes.toString(16);
      throw new Error(`File not decodable. Expected 0x00 at position ${position}, found 0x${hexString}`)
    }
    header.streamStructureVersion = bytes;
  }
}
