const Seneca = require('seneca')
const PinoLogAdapter = require('seneca-pino-adapter')
const EchoService = require('../src/service')

const serviceConfig = {
  tag: 'echo-reply',

  fixedargs: {
    fatal$: false
  },

  legacy: {
    error: false,
    transport: false
  },

  internal: {
    logger: new PinoLogAdapter({
      config: {
        level: process.env.LOG_LEVEL || 'info'
      }
    })
  }
}

const service = Seneca(serviceConfig)

service.use(require('../src/mesh'), {
  isbase: false,
  listen: [{ pin: 'role:echo', port: 39998, host: 'localhost' }]
})

EchoService({ seneca: service })
