const jsonStream = require('duplex-json-stream')
const net = require('net')

let log = []

const server = net.createServer(function (socket) {
    socket = jsonStream(socket)

    socket.on('data', function (msg) {
        console.log('\nBank received:', msg)

        let result = handleTransaction(log, msg.cmd, msg.amount)

        if (result.success) {
            log.push(msg)
        }

        socket.write(result.msg)

        console.log('Current transaction log:', log)
    })
})

function handleTransaction (log, command, amount) {

    var message
    var success = true
    switch (command) {
        case 'balance':
            message = `Current balance is ${calcBalance(log)}`
            break;
        case 'deposit':
            message = `Deposited ${amount} to account.`
            break;
        case 'withdraw':
            let currentBalance = calcBalance(log)
            
            if (amount > currentBalance) {
                message = `Cannot withdraw specified amount because of insufficient funds. Current balance is: ${currentBalance}`
                success = false
            } else {
                message = `Withdrew ${amount} from account.`
            } 
            break;
    }

    return {msg: message, success: success}
}

function calcBalance(log) {
    return log.reduce(function (total, transaction) {
        if (transaction.cmd === 'deposit') {
            return total + transaction.amount
        } else if (transaction.cmd === 'withdraw') {
            return total - transaction.amount
        } else {
            return total
        }
    }, 0)
}

server.listen(3876)
