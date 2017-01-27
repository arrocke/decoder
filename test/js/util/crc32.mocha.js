import {expect} from 'chai'
import crc32 from '../../../src/util/crc32'
import createBuffer from '../buffers/create-buffer'
import validVideo from '../buffers/valid-video'

describe('validateCRC32()', () => {
  let buffer, view, checksum

  it('It should return the checksum for 1 byte.', () => {
    buffer = new ArrayBuffer(32)
    view = new DataView(buffer)
    for (var i = 0; i < view.byteLength; i++) {
      view.setUint8(i, Math.floor(Math.random() * 256))
    }
    checksum = crc32(view)
    expect(crc32(view, checksum)).to.equal(0)
  })

  it('It should return true if the page is valid.', () => {
    buffer = createBuffer(validVideo)
    view = new DataView(buffer, 0, 92)
    checksum = view.getUint8(22)
      + view.getUint8(23) * Math.pow(2, 8)
      + view.getUint8(24) * Math.pow(2, 16)
      + view.getUint8(25) * Math.pow(2, 24)
    view.setUint32(22, 0)
    expect(crc32(view)).to.equal(checksum)
    expect(crc32(view, checksum)).to.equal(0)
  })
})
