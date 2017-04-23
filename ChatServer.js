const ClientSession = require('./ClientSession')

class ChatServer {

    constructor(socketServer) {

        this._socketServer = socketServer
        this._socketServer.on('connection', socket => this._registerSession(socket))

        this._sessions = []
        this._users = []
    }


    _registerSession(socket) {
        socket.on('command', (...args) => this._handleCommand(socket.id, ...args));
        socket.on('chat', (...args) => this._handleChat(socket.id, ...args));

        this._sessions[socket.id] = new ClientSession(socket);
    }

    _handleCommand(id, ...args) {
        switch (args[0].cmdName) {
            case 'register': this._handleRegister(id, ...args); break;
            case 'login': this._handleLogin(id, ...args); break;
            case 'logout': this._handleLogout(id, ...args); break;
        }
    }

    _handleRegister(id, ...args) {
        const session = this._sessions[id]

        this._users.push(args[0].name, args[0].password)

        // console.log(`User '${args.name}'was registers`)
        console.log(`User was registers`)
    }

    _handleChat(id, message) {
        if (this._users)
            this._socketServer.sockets.emit('chat', message);
        console.log('chat:', message);
    }


    _handleLogin(id, ...args) {
        const session = this._sessions[id];

        session.socket.emit('command', `Success: '/${name}'.`);
    }

    _handleLogout(id, ...args) {
        const index = this._sessions.find(session => session.id === id)
        if (index)
            this._sessions.splice(index, 1)
    }

    _findUserByName(name) {
        return this._sessions.find(user => user.name === name)
    }
}


module.exports = ChatServer;