const translator_configs = require('../translator_configs')
const Browser = require('./browser')

class Translator extends Browser {
  constructor() {
    super(translator_configs)
  }

  _get_target_language_ele(page) {
    return page.$('div.result-shield-container span.tlid-translation span')
  }

  translate({
    sl = 'auto',
    tl = 'en',
    text = ''
  }) {
    const page = this.get_free_page()
    if (page === undefined) {
      return Promise.reject('pages in busy')
    }

    // for async
    return page.goto(encodeURI(`${this.url}#view=home&op=translate&sl=${sl}&tl=${tl}&text=${text}`))
    .then(() => this._get_target_language_ele(page)
    .then(ele => ele.getProperty('textContent')
    .then(text => {
      this.release_page(page)
      return text.jsonValue()
    })))
  }
}

module.exports = Translator
