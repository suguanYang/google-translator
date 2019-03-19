const Translator = require('./translator')
const configs = require('./translator_configs')
const events = require('./browser_events')

const googleTranslator = new Translator(configs)

googleTranslator.start()

googleTranslator.on(events.BROWSER_SET_UPED, () => {
  console.dir(googleTranslator)
})
