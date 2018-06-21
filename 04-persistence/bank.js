const jsonStream = require('duplex-json-stream')
const net = require('net')
const fs = require('fs')

// Create a new log if there isn't one
initializeLog()

const server = net.createServer(function (socket) {
    socket = jsonStream(socket)

    socket.on('data', function (data) {

        var log = require('./log.json')

        console.log('\nBank received:', data)

        let result = handleTransaction(log, data.cmd, data.amount)

        if (result.writeToLog) {
            writeTransaction(log, data)
        }

        socket.write(result.msg)
    })
})

function initializeLog () {
    // wx system flag will provide error if log already exists
    fs.writeFile('./log.json', '[]', {flag: 'wx'}, function (err) {
        if (err) {
            console.log('log.json already exists.\nUsing previously existing log.')
        } else {
            console.log('Created a new log.json')
        }
    })
}

function writeTransaction (log, msg) {
    log.push(msg)

    // Write new transaction to log
    fs.writeFile('./log.json', JSON.stringify(log, null, 2), function (err) {
        if (err) throw err;
    })
}

function handleTransaction (log, command, amount) {
    var message
    var writeToLog = true
    
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
                writeToLog = false
            } else {
                message = `Withdrew ${amount} from account.`
            } 
            break;
        case 'log':
            message = JSON.stringify(log, null, 2)
            writeToLog = false
            break;
    }

    return {msg: message, writeToLog: writeToLog}
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
