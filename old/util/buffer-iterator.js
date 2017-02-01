export default class BufferIterator {
  constructor(buffer, offset = 0, length = buffer.byteLength - offset) {
    this._buffer = buffer
    this._view = new DataView(buffer, offset, length)
    this._position = 0
  }
  get _byteLength() {
    return this._view.byteLength
  }
  get hasBytes() {
    return this._position < this._byteLength
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
  getBytesAsArray(len) {
    let bytes = new Array(len)
    for (var i = 0; i < len; i++) {
      bytes[i] = this._view.getUint8(this._position++)
    }
    return bytes
  }
  getBytesAsDataView(len) {
    if (this._position + len > this._byteLength) {
      throw new RangeError()
    }
    let view = new DataView(this._buffer, this._position, len)
    this._position += len
    return view
  }
}