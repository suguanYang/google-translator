const puppeteer = require('puppeteer')
const EventEmitter = require("events").EventEmitter

const events = require('./browser_events')
const extend = require('../../lib').extend

function Browser(configs) {
  // private members
  let $browser = null
  let $pages = []
  let $context = null
  let $status = Symbol('status')
  let $index = Symbol('index')
  let $that = null
  // constructor
  EventEmitter.apply(this)
  this.url = configs.url
  this.max_pages = configs.max_pages
  $that = this

  const $register_pages = () => {
    const empty_array = new Array(10).fill(null)
    return empty_array.map((_, index) => $context.newPage().then(page => {
      page[$status] = 'free'
      page[$index] = index
      return page
    }))
  }

  this.get_free_page = function() {
    const page = $pages.find(p => p[$status] === 'free')
    // TODO add concurrence
    if (page === undefined) {
      this.emit(events.BUSY)
      return
    }
    page[$status] = 'busy'
    return page
  }

  this.release_page = function(page) {
    page[$status] = 'free'
    $that.emit(events.FREE)
  }

  this.start = async function() {
    if ($browser) return
    $browser = await puppeteer.launch()
    $context = await $browser.createIncognitoBrowserContext()
    $pages = await Promise.all($register_pages())
    this.emit(events.SET_UPED)
  }

  this.exit = async function () {
    await $browser.close()
  }
}

extend(Browser, EventEmitter)

module.exports = Browser
