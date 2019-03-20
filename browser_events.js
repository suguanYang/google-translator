const suffix = 'browser'

const create_event = (event) => `${suffix}_${event}`

exports.SET_UPED = create_event('set_uped')
exports.BUSY = create_event('busy')
exports.FREE = create_event('free')
