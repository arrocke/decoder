import {expect} from 'chai'
import crc32 from '../../../src/util/crc32'
import createBuffer from '../buffers/create-buffer'

describe('validateCRC32()', () => {
  let buffer, view, checksum

  it('It should return the checksum for 1 byte.', () => {
    buffer = new ArrayBuffer(4)
    view = new DataView(buffer)
    view.setUint8(0, 0x36)
    view.setUint8(1, 0x02)
    view.setUint8(2, 0xA0)
    view.setUint8(3, 0x34)
    expect(crc32(view)).to.equal(0xBAE684F8)
  })

  it('It should return true if the page is valid.', () => {
  })
})
