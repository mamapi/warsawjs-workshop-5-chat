var http = require('http');
var io = require('socket.io')
const ChatServer = require('./ChatServer')


var createServer = function (callback, callbackError) {

    return new Promise((resolve, reject) => {
        var server = http.createServer();

        server.on('listening', () => resolve(server))
        server.on('error', reject)

        server.listen(3001);
    })

}

createServer()
    .then((server) => {
        console.log('started!')
        var socketServer = io(server)

        const chatServer = new ChatServer(socketServer);


    })
    .catch((err) => {
        console.error(`error ${err}`)
    })
