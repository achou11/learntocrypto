const jsonStream = require('duplex-json-stream')
const net = require('net')

const client = jsonStream(net.connect(3876))

client.on('data', function (msg) {
    console.log('Teller received:', msg)
})

client.end({ cmd: 'balance' })

