const DIVISOR = 0x04c11db7
const BYTE = 8

function maskBit(byte, pos, N = 8) {
  let mask = Math.pow(2, N - 1 - pos)
  return (mask & byte) == mask
}

function shift(r, bit) {
  return (r << 1) | bit
}

export default function validateCRC32(view, check) {
  let bytes = new Array(view.byteLength + 4)
  for (let i = 0; i < view.byteLength; i++) {
    bytes[i] = view.getUint8(i)
  }
  bytes[view.byteLength + 0] = check >>> 24
  bytes[view.byteLength + 1] = (check << 8) >>> 24
  bytes[view.byteLength + 2] = (check << 16) >>> 24
  bytes[view.byteLength + 3] = (check << 24) >>> 24

  let buffer = bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3]
  let pos = 4 * BYTE
  buffer = buffer ^ DIVISOR
  while (pos < bytes.length * BYTE - 1) {
    //while(buffer >>> 31 == 0 && pos < bytes.length * BYTE) {
    //  buffer = shift(buffer, maskBit(bytes[Math.floor(pos / BYTE)], pos++ % BYTE))
    //}
    if (buffer == 0 && pos < bytes.length * BYTE - 4) {
      buffer = shift(buffer, maskBit(bytes[Math.floor(pos / BYTE)], pos++ % BYTE))
      buffer = shift(buffer, maskBit(bytes[Math.floor(pos / BYTE)], pos++ % BYTE))
      buffer = shift(buffer, maskBit(bytes[Math.floor(pos / BYTE)], pos++ % BYTE))
    }
    buffer = shift(buffer, maskBit(bytes[Math.floor(pos / BYTE)], pos++ % BYTE))
    buffer = buffer ^ DIVISOR
  }
  return buffer
}
