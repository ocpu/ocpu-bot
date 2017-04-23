const Discordie = require('discordie')
const client = new Discordie()

client.connect({
    token: 'MzA1NjQxNzg0MzYzNDUwMzkw.C94hJA.wBtsO2sF2rt5ZcIDRRLUCTuwMJg'
})

client.Dispatcher.on(Discordie.Events.GATEWAY_READY, function(e) {
    console.log(`Connected as: ${client.User.username}`)
})

client.Dispatcher.on(Discordie.Events.MESSAGE_CREATE, function(e) {
    if (e.message.content === 'PING')
        e.message.channel.sendMessage('PONG')
    console.log(e)
})