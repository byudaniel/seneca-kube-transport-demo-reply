function EchoService({ seneca }) {
  seneca.add('role:echo,cmd:execute', function(msg, reply) {
    reply({ ok: true, received: Date.now(), message: 'v8' })
  })

  seneca.ready(() => {
    seneca.act('role:greet,cmd:execute,mesage:hi', function(err, result) {
      if (err) {
        return console.error('***error')
      }
      console.log('***result', result)
    })
  })
}

module.exports = EchoService
