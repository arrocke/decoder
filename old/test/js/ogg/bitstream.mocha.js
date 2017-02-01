import {expect} from 'chai'
import Bitstream from '../../../src/ogg/bitstream'
import OggPage from '../../../src/ogg/page'

describe('Bitstream', () => {
  describe('functionality', () => {
    let bitstream

    beforeEach(() => {
      bitstream = new Bitstream()
    })

    describe('addPage', () => {
      let page

      beforeEach(() => {
        let buffer = new ArrayBuffer(22)
        page = new OggPage({
          headerType: 0x02,
          granulePosition: 0,
          bitstreamSerialNumber: 1,
          pageSequenceNumber: 0,
          segmentTable: [10, 12],
          view: new DataView(buffer)
        })
      })

      it('It should add to page array.', () => {
        bitstream.addPage(page)
        expect(bitstream._pages[0]).to.equal(page)
      })

      it('It should not add to page array if the page is not an instance of OggPage.', () => {
        bitstream.addPage({})
        expect(bitstream._pages[0]).to.be.undefined
      })
    })
  })
})
