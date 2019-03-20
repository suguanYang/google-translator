const puppeteer = require('puppeteer')
const EventEmitter = require("events").EventEmitter

const events = require('./browser_events')
const extend = require('./lib').extend

function Translator(configs) {
  // private members
  $browser = null
  $pages = []
  $context = null

  // constructor
  EventEmitter.apply(this)
  this.url = configs.url
  this.max_pages = configs.max_pages
  const that = this

  const $register_pages = () => {
    const emptyArray = new Array(10).fill(null)
    return emptyArray.map(() => $context.newPage().then(page => {
      page.status = 'free'
      return page
    }))
  }

  const $get_free_page = function() {
    return $pages.findIndex(p => {
      return p.status === 'free'
    })
  }

  const $release_page = function(index) {
    $pages[index].status = 'free'
    that.emit(events.FREE)
  }

  const $get_target_ele = function(page) {
    return page.$('div.result-shield-container span.tlid-translation span')
  }

  this.start = async function() {
    $browser = await puppeteer.launch()
    $context = await $browser.createIncognitoBrowserContext()
    $pages = await Promise.all($register_pages())
    this.emit(events.SET_UPED)
  }

  this.translate = function(options = {
    sl: 'auto',
    tl: 'en',
    text: ''
  }) {
    const page_index = $get_free_page()
    if (page_index === -1) {
      this.emit(events.BUSY, options)
      return Promise.reject('pages in busy')
    }

    // page, a reference of $pages' element
    const page = $pages[page_index]
    page.status = 'busy'
    return page.goto(`${this.url}#view=home&op=translate&sl=${options.sl}&tl=${options.tl}&text=${options.text}`)
    .then(
      () => $get_target_ele(page).then(ele => {
        $release_page(page_index)
        return ele.getProperty('textContent').then(text => text.jsonValue())
      })
    )
  }

  this.exit = async function () {
    console.log('closing browser.....')
    await $browser.close()
  }
}


// class Translator extends EventEmitter {
//   constructor(configs) {
//     this.url = configs.url
//   }
//
//   start() {
//     puppeteer.launch().then(async browser => {
//       this.browser = browser
//
//       const context = await browser.createIncognitoBrowserContext()
//       const page = await context.newPage();
//       this.emit(events.BROWSER_SET_UPED)
//     })
//   }
// }

extend(Translator, EventEmitter)

module.exports = Translator
