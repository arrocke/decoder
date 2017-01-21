import {expect} from 'chai'
import OggDecoder from '../../../src/ogg/decoder'
import Bitstream from '../../../src/ogg/bitstream'
import createBuffer from '../buffers/create-buffer'
import validVideo from '../buffers/valid-video'

describe('OggDecoder', () => {
  describe('construction', () => {

  })

  describe('functionality', () => {
    var buffer, decoder, view


    describe('decode()', () => {
      describe('for valid ogg files', () => {
        var bitstreams

        before(() => {
          buffer = createBuffer(validVideo)
          view = new DataView(buffer)
          decoder = new OggDecoder(buffer)
          bitstreams = decoder.decode()
        })

        it('It should return an array of bitstreams.', () => {
          expect(bitstreams[0]).to.be.instanceOf(Bitstream)
          expect(bitstreams[1]).to.be.instanceOf(Bitstream)
        })

        it('It should')
      })

      describe('for invalid ogg files', () => {
        beforeEach(() => {
          buffer = createBuffer(validVideo)
          view = new DataView(buffer)
          decoder = new OggDecoder(buffer)
        })

        it('It should throw an error if a bitstream has a second BOS page.', () => {

        })
      })
    })

    describe.skip('decodeHeader', () => {
      it('It should throw an error if the capture pattern is not found.', () => {
        view.setUint8(1, 0)
        expect(decoder.decodeHeader.bind(decoder)).to.throw(Error)
      })

      it('It should not throw an error if the capture pattern is found.', () => {
        expect(decoder.decodeHeader.bind(decoder)).to.not.throw(Error)
      })

      it('It should throw an error if the stream structure version is invalid.', () => {
        view.setUint8(4, 1)
        expect(decoder.decodeHeader.bind(decoder)).to.throw(Error)
      })

      it('It should not throw an error if the stream sturcture version is correct.', () => {
        expect(decoder.decodeHeader.bind(decoder)).to.not.throw(Error)
      })

      it('It should add a new bitstream if the header as a header type of BOS.', () => {
        deocder.decodeHeader()
      })
    })
  })
})
