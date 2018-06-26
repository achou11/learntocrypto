const jsonStream = require('duplex-json-stream')
const net = require('net')

const client = jsonStream(net.connect(3876))

var transaction
if (process.argv[2]) {
    switch (process.argv[2]) {
        case 'balance':
            transaction = {cmd: 'balance'}    
            break;
        case 'deposit':
            transaction = {cmd: 'deposit', amount: Number(process.argv[3])}
            break;
        case 'withdraw':
            transaction = {cmd: 'withdraw', amount: Number(process.argv[3])}
            break;
        case 'log':
            transaction = {cmd: 'log'}
            break;
        default:
            console.error('Please request an accepted transaction type: balance, deposit, withdraw')
            break;
    }
} else {
    console.error('Please provide a transaction (balance, deposit, or withdraw) as the first argument')
}


client.on('data', function (msg) {
    console.log(msg)
})

client.end(transaction)

