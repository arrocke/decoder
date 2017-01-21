export default class OggPage {
  constructor(options = {}) {
    this._headerType = options.headerType
    this._granulePosition = options.granulePosition
    this._bitstreamSerialNumber = options.bitstreamSerialNumber
    this._pageSequenceNumber = options.pageSequenceNumber
    this._segmentTable = options.segmentTable.slice()
    this._view = options.view
  }
  get headerType() {
    return this._headerType
  }
  get granulePosition() {
    return this._granulePosition
  }
  get bitstreamSerialNumber() {
    return this._bitstreamSerialNumber
  }
  get pageSequenceNumber() {
    return this._pageSequenceNumber
  }
  get segmentTable() {
    return this._segmentTable.slice()
  }
  get view() {
    return this._view
  }
}
