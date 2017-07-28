module.exports = {
    name: 'ping',
    alias: ['p'],
    exec(e) {
        this.channel.sendMessage('pong')
    }
}