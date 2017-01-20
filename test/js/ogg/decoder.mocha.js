import {expect} from 'chai'
import OggDecoder from '../../../src/ogg/decoder'
import oggHeader from '../buffers/ogg-header.js'

describe('OggDecoder', () => {
  describe('construction', () => {

  })

  describe('functionality', () => {
    describe('decodeHeader', () => {
      var buffer

      before(() => {
        buffer = oggHeader
      })

      it('It should be true.', () => {
        expect(buffer.byteLength).to.equal(5)
      })
    })
  })
})
