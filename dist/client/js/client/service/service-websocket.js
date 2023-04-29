/**
 * Service responsible for the websocket connection with the server
 */
class ServiceWebSocket {
    //Client WebSocket
    socket;
    //Event handlers to trigger on messages from the server
    events;
    /**
     * Constructor
     */
    constructor() {
        this.socket = null;
        this.events = new Map();
        this.connect();
    }
    /**
     * try to connects to the server
     */
    async connect() {
        const response = await fetch("/api/websocket-url");
        if (response.ok) {
            const url = await response.text();
            this.socket = new WebSocket(url);
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
        else {
            console.error("Unable to get websocket url.");
        }
    }
    /**
     * Adds an event handler on a type of message from the server
     * @param { string } type Type of message which will trigger the event
     * @param {WebSocketEvent } callback Function to call when the event is triggered
     */
    addEventListener(type, callback) {
        this.events.set(type, callback);
    }
    /**
     * Emits a message to the server
     * @param { string } type Type of message to send
     * @param { string } data Data of the message to send
     */
    emit(type, data) {
        this.socket?.send(JSON.stringify({
            type: type,
            data: data
        }));
    }
}
export const serviceWebSocket = new ServiceWebSocket();
