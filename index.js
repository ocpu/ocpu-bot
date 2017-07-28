const Discordie = require('discordie')
const Events = Discordie.Events
const client = new Discordie()
const botCommands = new Map()
const fs = require('fs')
const { join } = require('path')

fs.readdir(join(__dirname, 'commands'), (err, files) => {
    if (err) console.error(err)
    const commands = files.map(file => require(`./commands/${file}`))
    commands.forEach(({ name, alias, exec }) => {
        botCommands.set(name, exec)
        if (alias) alias.forEach(name => {
            botCommands.set(name, exec)
        })
    })
})

client.connect({ token: 'MzA1NjQxNzg0MzYzNDUwMzkw.C94hJA.wBtsO2sF2rt5ZcIDRRLUCTuwMJg' })

client.Dispatcher.on(Events.GATEWAY_READY, e => {
    console.log(`Connected as: ${client.User.username}`)
})

const cmdRegex = /\:([^\s]*)/

client.Dispatcher.on(Events.MESSAGE_CREATE, e => {
    const createdMessage = e.message.content
    if (createdMessage.startsWith(':')) {
        const command = cmdRegex.exec(createdMessage)[1]
        if (!botCommands.has(command))
            return
        let argString = createdMessage.substring(command.length + 1)
        const matches = []
        const argsRegex = /(?: ?([\w"]+))/g
        let match
        while ((match = argsRegex.exec(argString)) !== null)
            matches.push(match[1])
        let inArgsStr = false
        const args = []
        for (let item of matches) {
            if (inArgsStr) args[args.length - 1] = `${args[args.length - 1]} ${item}`
            else args.push(item)
            if (item.startsWith('"')) {
                inArgsStr = true
                args[args.length - 1] = args[args.length - 1].substring(1)
            }
            if (item.endsWith('"')) {
                inArgsStr = false
                args[args.length - 1] = args[args.length - 1].substring(0, args[args.length - 1].length - 1)
            }
        }
        botCommands.get(command).call(e.message, args)
    }
})