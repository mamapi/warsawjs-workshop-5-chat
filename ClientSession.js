class ClientSession {
    constructor(socket) {
        this._socket = socket;
        this._isAuth = false;
    }


    get socket() {
        return _this.socket
    }


}




module.exports = ClientSession