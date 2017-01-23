const divisor = 0x04c11db7

function readBit(view, pos) {
  let byte = view.getUnit8(pos / 8)
  return getBit(byte, pos)
}

function getBit(byte, pos) {
  let mask = Math.pow(2, 7 - pos % 8)
  return mask & byte
}

function shift(r, bit) {
  return (r << 1) + bit
}

export default function crcValidate(view, check, n = 32) {
  let pos = 32
  let bits = view.getUint32(0)
  let power24 = Math.pow(2, 24)
  while (pos < view.byteLength * 8) {
    bits = bits ^ divisor
    while (0 == getBit(bits / power24, pos)) {
      let newBit = readBit(view, n++)
      bits = shift(bits, newBit)
    }
  }
}
