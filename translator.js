const puppeteer = require('puppeteer')
const EventEmitter = require("events").EventEmitter

const events = require('./browser_events')
const extend = require('./lib').extend

function Translator(configs) {
  // private members
  $browser = null
  $page = []
  $context = null

  // constructor
  EventEmitter.apply(this)
  this.url = configs.url

  this.start = function() {
    puppeteer.launch().then(async browser => {
      $browser = browser
      $context = await browser.createIncognitoBrowserContext()
      this.emit(events.BROWSER_SET_UPED)
    })
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
