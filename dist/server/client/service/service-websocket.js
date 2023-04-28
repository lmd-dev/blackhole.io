"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceWebSocket = void 0;
class ServiceWebSocket {
    constructor() {
        this.socket = null;
        this.events = new Map();
        this.connect();
    }
    connect() {
        this.socket = new WebSocket("ws://localhost:3000");
        this.socket.addEventListener("message", (event) => {
            var _a;
            try {
                const messageData = JSON.parse(event.data);
                (_a = this.events.get(messageData.type)) === null || _a === void 0 ? void 0 : _a(messageData.data);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    addEventListener(type, callback) {
        this.events.set(type, callback);
    }
    emit(type, data) {
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send(JSON.stringify({
            type: type,
            data: data
        }));
    }
}
exports.serviceWebSocket = new ServiceWebSocket();
