import {expect} from 'chai'
import OggDecoder from '../../../src/ogg/decoder'
import createBuffer from '../buffers/create-buffer'
import oggHeader from '../buffers/ogg-header'

describe('OggDecoder', () => {
  describe('construction', () => {

  })

  describe('functionality', () => {
    var buffer, decoder, view

    beforeEach(() => {
      buffer = createBuffer(oggHeader)
      view = new DataView(buffer)
      decoder = new OggDecoder(buffer)
    })

    describe('decodeHeader', () => {
      it('It should throw an error if the capture pattern is not found.', () => {
        view.setUint8(0)
        expect(decoder.decodeHeader.bind(decoder)).to.throw(Error)
      })

      it('It should not throw an error if the capture pattern is found.', () => {
        expect(decoder.decodeHeader.bind(decoder)).to.not.throw(Error)
      })
    })
  })
})
