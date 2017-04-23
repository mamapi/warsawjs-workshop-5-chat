class ClientSession {
    constructor(socket) {
        this._socket = socket;
        this.IsAuth = false;
    }


    get socket() {
        return this._socket
    }


}




module.exports = ClientSession