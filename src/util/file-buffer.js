export default class FileBuffer {
  constructor(buffer) {
    this._buffer = buffer
    this._view = new DataView(buffer)
  }
  get byteLength() {
    return this._view.byteLength;
  }
  getByte(offset) {
    return this._view.getUint8(offset)
  }
  getBytes(offset, length) {
    let bytes = []
    for (let i = offset; i < offset + length; i++)
      bytes.push(this._view.getUint8(i))
    return bytes
  }
}
