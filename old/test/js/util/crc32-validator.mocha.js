import {expect} from 'chai'
import validateCRC32 from '../../../src/util/validate-crc32'
import createBuffer from '../buffers/create-buffer'

describe('validateCRC32()', () => {
  let buffer, view, checksum

  it('It should return the checksum for 1 bit.', () => {
    buffer = new ArrayBuffer(1)
    view = new DataView(buffer)
    view.setUint8(0, 255)
    expect(validateCRC32(view, 0)).to.equal(0xFF000000)
  })

  it('It should return true if the page is valid.', () => {
  })
})
