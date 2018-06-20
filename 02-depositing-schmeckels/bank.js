const jsonStream = require('duplex-json-stream')
const net = require('net')

let log = []

const server = net.createServer(function (socket) {
    socket = jsonStream(socket)

    socket.on('data', function (msg) {
        console.log('Bank received:', msg)

        log.push(msg)

        console.log('Current transaction log:', log)
        
        if (msg.cmd === 'balance') {
            socket.write({cmd: 'balance', balance: calcBalance(log)})
        } else if (msg.cmd === 'deposit') {
            socket.write(`Deposited ${msg.amount} to account.`)
        }
    })
})

function calcBalance(log) {
    return log.reduce(function (total, transaction) {
        if (transaction.cmd === 'deposit') {
            return total + transaction.amount
        } else {
            return total
        }
    }, 0)
}

server.listen(3876)
