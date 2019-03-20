const Translator = require('./translator')
const configs = require('./translator_configs')
const events = require('./browser_events')

const googleTranslator = new Translator(configs)

googleTranslator.start()
googleTranslator.on(events.SET_UPED, () => {
  // googleTranslator.translate({}).then(value => {
  //   console.log(value)
  // })
})


process.on('exit', code => {
  googleTranslator.exit()

  console.log('process exit with ' + code)
})
