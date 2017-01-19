export default class FileBuffer {
  constructor(buffer) {
    this._buffer = buffer;
    this._view = new DataView(buffer);
  }
  get byteLength() {
    return this._view.byteLength;
  }
  getByte(offset) {
    if (offset < this.byteLength)
      return this._view.getUint8(offset);
    else
      return null;
  }
  getBytes(offset, length) {
    var bytes = [];
    for (var i = offset; i < offset + length || i < this.byteLength; i++) {
      bytes.push(this.getBytes(i));
    }
    return bytes;
  }
}
