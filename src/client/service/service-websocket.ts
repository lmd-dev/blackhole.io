export type WebSocketEvent = (data: string) => void;

/**
 * Service responsible for the websocket connection with the server
 */
class ServiceWebSocket
{
    //Client WebSocket
    private socket: WebSocket | null;

    //Event handlers to trigger on messages from the server
    private events: Map<string, WebSocketEvent>;

    /**
     * Constructor
     */
    constructor()
    {
        this.socket = null;
        this.events = new Map();

        this.connect();
    }

    /**
     * try to connects to the server
     */
    private connect()
    {
        this.socket = new WebSocket("ws://localhost:3000");

        this.socket.addEventListener("message", (event) => {
            try {
                const messageData = JSON.parse(event.data);
                
                this.events.get(messageData.type)?.(messageData.data);
            }
            catch(e)
            {
                console.log(e);
            }
        })
    }

    /**
     * Adds an event handler on a type of message from the server
     * @param { string } type Type of message which will trigger the event 
     * @param {WebSocketEvent } callback Function to call when the event is triggered 
     */
    public addEventListener(type: string, callback: WebSocketEvent)
    {
        this.events.set(type, callback);
    }

    /**
     * Emits a message to the server
     * @param { string } type Type of message to send 
     * @param { string } data Data of the message to send 
     */
    public emit(type: string, data: string)
    {
        this.socket?.send(JSON.stringify({
            type: type, 
            data: data 
        }));
    }
}

export const serviceWebSocket = new ServiceWebSocket();