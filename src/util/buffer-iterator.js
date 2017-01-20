export default class BufferIterator {
  constructor(buffer, offset = 0, length = buffer.byteLength - offset) {
    this._buffer = buffer
    this._view = new DataView(buffer, offset, length)
    this._position = 0
  }
  getByte() {
    return this._view.getUint8(this._position++)
  }
  getBytes(len) {
    let bytes = 0
    for (var i = 0; i < len; i++) {
      bytes *= 256
      bytes += this._view.getUint8(this._position++)
    }
    return bytes
  }
}
