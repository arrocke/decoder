import {expect} from 'chai'
import OggDecoder from '../../../src/ogg/decoder'
import Bitstream from '../../../src/ogg/bitstream'
import createBuffer from '../buffers/create-buffer'
import validVideo from '../buffers/valid-video'

describe('OggDecoder', () => {
  describe('construction', () => {

  })

  describe('functionality', () => {
    var buffer, decoder, view, page

    describe('decodePage (buffers/valid-video.js is used as the test video)', () => {
      beforeEach(() => {
        buffer = createBuffer(validVideo)
        view = new DataView(buffer)
        decoder = new OggDecoder(buffer)
      })

      describe('for valid pages', () => {
        beforeEach(() => {
          page = decoder.decodePage()
        })

        it('It should decode and save the header type flag.', () => {
          expect(page.headerType).to.equal(0x02)
        })

        it('It should decode and save the granule position.', () => {
          expect(page.granulePosition).to.eql([0, 0, 0, 0, 0, 0, 0, 0])
        })

        it('It should decode and save the bitstream serial number.', () => {
          expect(page.bitstreamSerialNumber).to.equal(0x80bc815f)
        })

        it('It should decode and save the page sequence number.', () => {
          expect(page.pageNumber).to.equal(0)
        })

        it('It should decode the segmentTable', () => {
          expect(page.segmentTable).to.eql([0x40])
        })

        it('It should create a view to the page payload.', () => {
          expect(page.view.buffer).to.equal(buffer)
          expect(page.view.byteOffset).to.equal(28)
          expect(page.view.byteLength).to.equal(0x40)
        })

        it('It should add page to its logical bitstream.', () => {
          expect(decoder.getLogicalBitstream(page.bitstreamSerialNumber)[0]).to.equal(page)
        })
      })

      describe('for invalid pages', () => {
        it('It should throw an error if the capture pattern is not found.', () => {
          view.setUint8(1, 0)
          expect(decoder.decodePage.bind(decoder)).to.throw(Error)
        })

        it('It should throw an error if the stream structure version is incorrect.', () => {
          view.setUint8(4, 1)
          expect(decoder.decodePage.bind(decoder)).to.throw(Error)
        })

        it('It should throw an error if a non-BOS page is from a new bitstream.', () => {
          view.setUint8(5, OggDecoder.FRESH_PACKET)
          expect(decoder.decodePage.bind(decoder)).to.throw(Error)
        })

        it('It should throw an Error if a BOS page is found for an already existing bistream.', () => {
          view.setUint8(225, OggDecoder.BOS)
          decoder.decodePage()
          decoder.decodePage()
          decoder.decodePage()
          expect(decoder.decodePage.bind(decoder)).to.throw(Error)
        })

        it('It should throw an Error if a BOS page is found in the middle of a stream.', () => {
          view.setUint8(7732, OggDecoder.BOS)
          view.setUint32(7741, 0)
          decoder.decodePage()
          decoder.decodePage()
          decoder.decodePage()
          decoder.decodePage()
          decoder.decodePage()
          decoder.decodePage()
          expect(decoder.decodePage.bind(decoder)).to.throw(Error)
        })

        it('It should throw an error if the CRC check sum is invalid.', () => {
          view.setUint8(22, 255)
          expect(decoder.decodePage.bind(decoder)).to.throw(Error)
        })
      })
    })
  })
})
