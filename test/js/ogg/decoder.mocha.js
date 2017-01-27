import {expect} from 'chai'
import OggDecoder from '../../../src/ogg/decoder'
import createBuffer from '../buffers/create-buffer'
import validVideo from '../buffers/valid-video'

describe('OggDecoder', () => {
  describe('decodePage() - buffers/valid-video.js is used as the test video', () => {
    let buffer, decoder, view

    describe('for valid pages', () => {
      let pages

      before(() => {
        buffer = createBuffer(validVideo)
        view = new DataView(buffer)
        decoder = new OggDecoder(buffer)
        pages = []
        while (decoder.hasBytes) {
          pages.push(decoder.decodePage())
        }
      })

      it('It should decode and save the header type flag.', () => {
        expect(pages[0].headerType).to.equal(0x02)
        expect(pages[7].headerType).to.equal(0x00)
      })

      it('It should decode and save the granule position.', () => {
        expect(pages[0].granulePosition).to.eql([0, 0, 0, 0, 0, 0, 0, 0])
        expect(pages[7].granulePosition).to.eql([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
      })

      it('It should decode and save the bitstream serial number.', () => {
        expect(pages[0].bitstreamSerialNumber).to.equal(0x5F81BC80)
        expect(pages[7].bitstreamSerialNumber).to.equal(0x7888D5A2)
      })

      it('It should decode and save the page sequence number.', () => {
        expect(pages[0].pageNumber).to.equal(0)
        expect(pages[7].pageNumber).to.equal(2)
      })

      it('It should decode the segmentTable', () => {
        expect(pages[0].segmentTable).to.eql([0x40])
        expect(pages[7].segmentTable).to
          .eql([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF])
      })

      it('It should create a view to the page payload.', () => {
        expect(pages[0].view.buffer).to.equal(buffer)
        expect(pages[0].view.byteOffset).to.equal(28)
        expect(pages[0].view.byteLength).to.equal(64)
        expect(pages[7].view.buffer).to.equal(buffer)
        expect(pages[7].view.byteOffset).to.equal(7799)
        expect(pages[7].view.byteLength).to.equal(4335)
      })

      it('It should add page to its logical bitstream.', () => {
        expect(decoder.getLogicalBitstream(pages[0].bitstreamSerialNumber)[pages[0].pageNumber]).to.equal(pages[0])
        expect(decoder.getLogicalBitstream(pages[7].bitstreamSerialNumber)[pages[7].pageNumber]).to.equal(pages[7])
      })
    })

    describe('for invalid pages', () => {
      beforeEach(() => {
        buffer = createBuffer(validVideo)
        view = new DataView(buffer)
        decoder = new OggDecoder(buffer)
      })

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
