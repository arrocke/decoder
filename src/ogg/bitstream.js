import OggPage from './page'

export default class Bitstream {
  constructor() {
    this._pages = []
  }
  get pages() {
    return pages.slice()
  }
  addPage(page) {
    if (page instanceof OggPage) {
      this._pages.push(page)
    }
  }
}
