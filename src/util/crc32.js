const DIVISOR = 0x04c11db7
const INITIAL_VALUE = 0
const FINAL_XOR = 0

export default function crc32(view, check) {
  // Set up the CRC buffer.
  let bytes = new ArrayBuffer(view.byteLength + 4)
  let newView = new DataView(bytes)
  for (let i = 0; i < view.byteLength; i++) {
    newView.setUint8(i, view.getUint8(i))
  }
  newView.setUint8(view.byteLength + 0, check >>> 24)
  newView.setUint8(view.byteLength + 1, (check << 8) >>> 24)
  newView.setUint8(view.byteLength + 2, (check << 16) >>> 24)
  newView.setUint8(view.byteLength + 3, (check << 24) >>> 24)

  // Initialize the buffer.
  let buffer = INITIAL_VALUE

  // Divide and shift for each bit.
  for (let pos = 0; pos < newView.byteLength * 8; pos++) {
    buffer = ((buffer << 1)
      | ((newView.getUint8(pos >>> 3) << (24 + pos % 8)) >>> 31))
      ^ (DIVISOR * (buffer >>> 31))
  }

  return buffer ^ FINAL_XOR
}
