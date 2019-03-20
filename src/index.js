const Translator = require('./translator')
const events = require('./browser/browser_events')

const googleTranslator = new Translator()

googleTranslator.start()
googleTranslator
googleTranslator.on(events.SET_UPED, () => {
  googleTranslator.translate({
    tl: 'zh-CN',
    text: 'hi there'
  }).then(value => {
    console.log(value)
  })
})


process.on('exit', code => {
  googleTranslator.exit()

  console.log('process exit with ' + code)
})
