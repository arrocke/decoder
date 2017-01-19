export default class FileBuffer {
  constructor(buffer) {
    this._buffer = buffer
    this._view = new DataView(buffer)
  }
  get byteLength() {
    return this._view.byteLength;
  }
  getByte(offset) {
    if (offset < this.byteLength)
      return this._view.getUint8(offset)
    else
      return null
  }
  getBytes(offset, length) {
    let bytes = []
    let bound = Math.min(offset + length, this.byteLength)
    for (let i = offset; i < bound; i++)
      bytes.push(this._view.getUint8(i))
    return bytes
  }
}
