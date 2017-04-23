const io = require('socket.io-client')
const readline = require('readline')
const os = require('os')
const colors = require('colors/safe')


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
        socket.emit('chat:command', { cmdName: cmdName, cmdArgs: cmdArgs })
    }
    else {
        socket.emit('chat:message', line)
    }

})


socket.on('chat:message', (message) => {
    writeLine(message);
})

socket.on('chat:command', (message) => {
    writeLine(colors.green(message))
})

socket.on('chat:error', (errorMessage) => {
    writeLine(colors.red(errorMessage))
})


