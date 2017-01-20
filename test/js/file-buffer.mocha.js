import {expect} from 'chai'
import FileBuffer from '../../src/util/file-buffer'

describe('FileBuffer', () => {
  describe('construction', () => {
    it('It should create a DataView from the buffer.', () => {
      let buffer = new ArrayBuffer(1)
      let fileBuffer = new FileBuffer(buffer)
      expect(fileBuffer._buffer).to.equal(buffer);
      expect(fileBuffer._view.buffer).to.equal(fileBuffer._buffer)
    })
  })

  describe('functionality', () => {
    let buffer, view, fileBuffer

    beforeEach(() => {
      buffer = new ArrayBuffer(4)
      view = new DataView(buffer);
      view.setUint8(0, 12);
      view.setUint8(1, 24);
      view.setUint8(2, 18);
      view.setUint8(3, 33);
      fileBuffer = new FileBuffer(buffer)
    })

    describe('byteLength', () => {
      it('It should return the byteLength of the ArrayBuffer.', () => {
        expect(fileBuffer.byteLength).to.equal(buffer.byteLength)
      })
    })

    describe('getByte()', () => {
      it('It should return the byte at the specified offset.', () => {
        let byteOffset = 1
        expect(fileBuffer.getByte(byteOffset)).to.equal(view.getUint8(byteOffset))
      })

      it('It should throw a range error if the specified offset is invalid.', () => {
        expect(fileBuffer.getByte.bind(fileBuffer, -1)).to.throw(RangeError)
        expect(fileBuffer.getByte.bind(fileBuffer, buffer.byteLength + 2)).to.throw(RangeError)
      })
    })

    describe('getBytes()', () => {
      it('It should return an array of bytes from the specified offset.', () => {
        let byteOffset = 2
        let expectedBytes = [view.getUint8(byteOffset), view.getUint8(byteOffset + 1)]
        expect(fileBuffer.getBytes(byteOffset, 2)).to.eql(expectedBytes)
      })

      it('It should throw a range error if the specified offset is invalid.', () => {
        expect(fileBuffer.getBytes.bind(fileBuffer, -1, 2)).to.throw(RangeError)
        expect(fileBuffer.getBytes.bind(fileBuffer, buffer.byteLength + 2, 2)).to.throw(RangeError)
      })
    })
  })
})
