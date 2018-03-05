const Seneca = require('seneca')
const PinoLogAdapter = require('seneca-pino-adapter')
const EchoService = require('../src/service')
const kubernetesNamespace = process.env.KUBERNETES_NAMESPACE || 'doneill'

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

service
  .use('kubernetes', {
    namespace: kubernetesNamespace,
    k8s_url: process.env.KUBERNETES_SERVICE_HOST,
    log: this.log
  })
  /*.listen({
    type: 'http',
    port: 39998,
    host: '0.0.0.0',
    protocol: 'http'
  })*/
  .ready(function() {
    EchoService({ seneca: this })

    const kubernetes = this.options().plugin.kubernetes
    const host = kubernetes.myip
    const bases = kubernetes.pods
      .filter(pod => pod.labels && pod.labels.domain === 'seneca-base')
      .filter(pod => pod.status === 'Running')
      .map(pod => pod.ip)
      .map(ip => `${ip}:39999`)

    console.log('***host', host, '***bases', bases)

    const isbase = false
    const listen = [{ pin: 'role:echo', port: 39998 }]
    //const port = 39997

    this.use(require('seneca-mesh'), {
      bases, //: ['10.109.213.116:39999']
      isbase,
      listen,
      sneeze: { silent: false },
      host
    })

    this.log.info('Seneca up and running')
  })
