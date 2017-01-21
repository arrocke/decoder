import {expect} from 'chai'
import BufferIterator from '../../../src/util/buffer-iterator'

describe('BufferIterator', () => {
  let buffer, view

  beforeEach(() => {
    buffer = new ArrayBuffer(10)
    view = new DataView(buffer)
    for (let i = 0; i < view.byteLength; i++) {
      view.setUint8(i, Math.floor(Math.random() * 256))
    }
  })

  describe('construction', () => {
    it('It should create a view on the buffer.', () => {
      let iterator = new BufferIterator(buffer)
      expect(iterator._view.buffer).to.equal(buffer)
    })

    it('It should set the offset of the view.', () => {
      let offset = 2
      let iterator = new BufferIterator(buffer, offset)
      expect(iterator._view.byteOffset).to.equal(offset)
    })

    it('It should set the length of the view.', () => {
      let offset = 2
      let length = 5
      let iterator = new BufferIterator(buffer, offset, length)
      expect(iterator._view.byteLength).to.equal(length)
    })

    it('It should set position to 0.', () => {
      let iterator = new BufferIterator(buffer)
      expect(iterator._position).to.equal(0)
    })
  })

  describe('functionality', () => {
    let iterator

    function initIterator(offset = 0, length = buffer.byteLength) {
      iterator = new BufferIterator(buffer, offset, length)
    }

    describe('hasBytes', () => {
      it('It should return true if position is less than the length.', () => {
        initIterator()
        iterator._position = 0
        expect(iterator.hasBytes).to.be.true
      })

      it('It should return false if position is greater than or equal to the length.', () => {
        initIterator()
        iterator._position = iterator._view.byteLength
        expect(iterator.hasBytes).to.be.false
      })
    })

    describe('getByte()', () => {
      it('It should return the byte as an integer.', () => {
        initIterator()
        let pos = iterator._position
        expect(iterator.getByte()).to.equal(view.getUint8(pos))
      })

      it('It should increment the position of the iterator.', () => {
        initIterator()
        let pos = iterator._position
        iterator.getByte()
        expect(iterator._position).to.equal(pos + 1)
      })

      it('It should throw an error if read past the end of the buffer.', () => {
        initIterator(0, 1)
        iterator.getByte()
        expect(iterator.getByte).to.throw(Error)
      })
    })

    describe('getBytes()', () => {
      it('It should return the bytes as an integer.', () => {
        initIterator()
        let pos = iterator._position
        expect(iterator.getBytes(4)).to.equal(view.getUint32(pos))
      })

      it('It should increment the position of the iterator.', () => {
        initIterator()
        let pos = iterator._position
        let len = 4
        iterator.getBytes(len)
        expect(iterator._position).to.equal(pos + len)
      })

      it('It should throw an error if read past the end of the buffer.', () => {
        initIterator(0, 1)
        expect(iterator.getBytes.bind(iterator, 4)).to.throw(Error)
      })
    })

    describe('getBytesAsArray()', () => {
      it('It should return the bytes as an array.', () => {
        initIterator()
        let pos = iterator._position
        let len = 4
        expect(iterator.getBytesAsArray(len)).to.eql([
          view.getUint8(0),
          view.getUint8(1),
          view.getUint8(2),
          view.getUint8(3)
        ])
      })

      it('It should increment the position of the iterator.', () => {
        initIterator()
        let pos = iterator._position
        let len = 4
        iterator.getBytesAsArray(len)
        expect(iterator._position).to.equal(pos + len)
      })

      it('It should throw an error if read past the end of the buffer.', () => {
        initIterator(0, 1)
        expect(iterator.getBytesAsArray.bind(iterator, 4)).to.throw(Error)
      })
    })

    describe('getBytesAsBuffer()', () => {
      it('It should return the bytes as an ArrayBuffer.', () => {
        initIterator()
        let pos = iterator._position
        let len = 4
        let buffer = iterator.getBytesAsBuffer(len)
        let view = new DataView(buffer)
        expect(view.getUint32(0)).to.eql(view.getUint32(pos))
      })

      it('It should increment the position of the iterator.', () => {
        initIterator()
        let pos = iterator._position
        let len = 4
        iterator.getBytesAsBuffer(len)
        expect(iterator._position).to.equal(pos + len)
      })

      it('It should throw an error if read past the end of the buffer.', () => {
        initIterator(0, 1)
        expect(iterator.getBytesAsBuffer.bind(iterator, 4)).to.throw(Error)
      })
    })
  })
})
