const jsonStream = require('duplex-json-stream')
const net = require('net')

const client = jsonStream(net.connect(3876))

var transaction
if (process.argv[2]) {
    switch (process.argv[2]) {
        case 'balance':
            transaction = {cmd: 'balance'}    
            break
        case 'deposit':
            let amount = process.argv[3] || 0;
            transaction = {cmd: 'deposit', amount: Number(amount)}
            break
        default:
            console.error('Invalid command-line arguments!')
            break
    }
} else {
    console.error('Please provide a transaction (balance or deposit) as the first argument')
}


client.on('data', function (msg) {
    console.log(msg)
})

client.end(transaction)

