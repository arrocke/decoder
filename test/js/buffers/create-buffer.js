export default function createBuffer(data) {
  var len = data.length / 2
  let buffer = new ArrayBuffer(len)

  let view = new DataView(buffer)
  for (var i = 0; i < len; i += 1) {
    view.setUint8(i, parseInt(data.substr(2 * i, 2), 16))
  }

  return buffer
}
