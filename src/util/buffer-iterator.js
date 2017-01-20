export default class BufferIterator {
  constructor(buffer, offset = 0, length = buffer.byteLength - offset) {
    this._buffer = buffer
    this._view = new DataView(buffer, offset, length)
    this._position = 0
  }
  getByte() {
    let byte = this._view.getUint8(this._position)
    this._position += 1
    return byte
  }
}
