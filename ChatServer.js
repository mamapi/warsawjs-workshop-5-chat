const ClientSession = require('./ClientSession')

class ChatServer {

    constructor(socketServer) {

        this._socketServer = socketServer
        this._sessions = {}
        this._users = []
    }

    run() {
        this._socketServer.on('connection', socket => this._registerSession(socket))
    }


    _registerSession(socket) {
        socket.on('chat:command', (...args) => this._handleCommand(socket.id, ...args));
        socket.on('chat:message', (...args) => this._handleChat(socket.id, ...args));

        this._sessions[socket.id] = new ClientSession(socket);
    }

    _handleCommand(id, command) {
        switch (command.cmdName) {
            case 'register': this._handleRegister(id, command); break;
            case 'login': this._handleLogin(id, command); break;
            case 'logout': this._handleLogout(id, command); break;
        }
    }

    _handleRegister(id, { cmdArgs }) {
        const session = this._sessions[id]

        const userName = cmdArgs[0]
        const pass = cmdArgs[1]
        this._users.push({ userName, pass })

        console.log(`User '${userName}' was registered`)
        session.socket.emit('chat:command', `Użytkownik '${userName}' został zarejestrowany`)
    }

    _handleChat(id, message) {
        const session = this._sessions[id]

        if (!session.IsAuth) {
            this._socketServer.sockets.emit('chat:error', 'Brak sesji. Musisz się zalogować');
        }
        else {
            this._socketServer.sockets.emit('chat:message', message);
            console.log('chat:', message);
        }
    }


    _handleLogin(id, { cmdArgs }) {
        const session = this._sessions[id];

        const userName = cmdArgs[0]
        const pass = cmdArgs[1]

        let user = this._users.find(user => user.userName === userName && user.pass === pass);
        if (!user)
            session.socket.emit('chat:error', 'Nieprawidłowy login lub hasło');
        else {
            session.socket.emit('chat:command', `Sukces. Jesteś zalogowany jako '${userName}'.`);
            session.IsAuth = true
            session.User = user
        }
    }

    _handleLogout(id) {

        const session = this._sessions[id]

        session.IsAuth = false;
        session.User = null;
        session.socket.emit('chat:command', `Zostałeś wylogowany`);
    }

}


module.exports = ChatServer;