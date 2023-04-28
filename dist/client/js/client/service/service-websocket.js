class ServiceWebSocket {
    socket;
    events;
    constructor() {
        this.socket = null;
        this.events = new Map();
        this.connect();
    }
    connect() {
        this.socket = new WebSocket("ws://localhost:3000");
        this.socket.addEventListener("message", (event) => {
            try {
                const messageData = JSON.parse(event.data);
                this.events.get(messageData.type)?.(messageData.data);
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
        this.socket?.send(JSON.stringify({
            type: type,
            data: data
        }));
    }
}
export const serviceWebSocket = new ServiceWebSocket();
