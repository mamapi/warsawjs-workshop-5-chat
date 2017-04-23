var io = require('socket.io-client')
var readline = require('readline')
var os = require('os')


const cli = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


const socket = io('http://localhost:3001')


function writeLine(line) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(line + os.EOL)

    cli.prompt(true)
}


cli.setPrompt('> ')
cli.prompt();

cli.on('line', (line) => {

    if (line[0] === '/') {
        const cmd = line.slice(1).split(' ')
        const cmdName = cmd[0]
        const cmdArgs = cmd.slice(1)
        socket.emit('command', { cmdName: cmdName, cmdArgs: cmdArgs })
    }
    else {
        socket.emit('chat', line)
    }

})


socket.on('chat', (message) => {
    writeLine(message);
})

socket.on('command', (message) => {
    writeLine(message)
})

socket.on('error', (errorMessage) => {
    writeLine(errorMessage)
})


