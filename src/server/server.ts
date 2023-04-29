import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyWebSocket from "@fastify/websocket";
import fastifyStatic from "@fastify/static";
import * as path from "path";

type MessageData = {
    type: string,
    data: string
}

export type EventCallback = (socketId: number, data: string) => void;

/**
 * Web server used by the application
 */
export class Server
{
    //Fastify instance
    private fastify: FastifyInstance;

    //Event handlers to trigger on messages from clients
    private events: Map<string, EventCallback>;

    //Clients connected to the server
    private clients: Map<number, WebSocket>;

    //Next ID to apply to the next connected socket
    private nextSocketId: number;

    /**
     * Constructor
     */
    constructor()
    {
        this.events = new Map();
        this.clients = new Map();
        this.nextSocketId = 0;

        this.fastify = Fastify();

        this.initStaticFiles();
        this.initAPIRoutes();
        this.initWebSocketRoutes();
    }

    /**
     * Initializes static files access
     */
    private initStaticFiles()
    {
        this.fastify.register(fastifyStatic, {
            root: path.join(__dirname, "..", "..", "client")
        });
    }

    /**
     * Initailizes routes for the available server API
     */
    private initAPIRoutes()
    {
        this.fastify.get("/api/websocket-url", (request: FastifyRequest, reply: FastifyReply) => {
            reply.send(`ws://localhost:${this.getPort()}/ws`);
        })
    }

    /**
     * Initializes WebSocket routes
     */
    private initWebSocketRoutes()
    {
        this.fastify.register(fastifyWebSocket);
    
        this.fastify.register(async (fastify) => {
            fastify.get('/ws', { websocket: true }, (connection , req) => {
                const socketId = ++this.nextSocketId;

                this.clients.set(socketId, connection.socket);

                connection.socket.on('message', (message) => {
                    this.processMessage(socketId, message.toLocaleString());
                })
            })
        })
    }

    /**
     * Starts the server listening 
     */
    public listen()
    {
        const port = this.getPort();

        this.fastify.listen({ port }, (error) => {
            if(error)
            {
                console.log("Server::listen - Error");
                console.log(error);
                return;
            }

            console.log(`Server is listening on port ${port}`);
        });
    }

    /**
     * Returns the port listened by the webserver 
     * @returns {number}The port listened by the webserver
     */
    private getPort(): number
    {
        return parseInt(process.env.WEBSERVER_PORT ?? "80");
    }

    /**
     * Adds an event handler on a type of message from clients
     * @param { string } type Type of message which will trigger the event 
     * @param { EventCallback } callback Function to call when the event is triggered 
     */
    public addEventListener(type: string, callback: EventCallback)
    {
        this.events.set(type, callback);
    }

    /**
     * Processes websocket message from clients
     * @param { socketId } Id of the client socket 
     * @param { message } Message sended by the client 
     */
    private processMessage(socketId: number, message: string)
    {
        try
        {
            const messageData = JSON.parse(message) as MessageData;

            this.events.get(messageData.type)?.(socketId, messageData.data);
        }
        catch(e)
        {
            console.log(e);
        }        
    }

    /**
     * Emits a message to connected clients 
     * @param { string } type Type of the message 
     * @param { string } data Data to send 
     * @param { socketId }Id of the client socket to send the message. If equal to 0, sends the message to all the connected clients (broadcast)
     */
    emit(type: string, data: string, socketId: number = 0)
    {
        const message = { type, data };

        const dataToSend = JSON.stringify(message);

        if(socketId !== 0)
            this.clients.get(socketId)?.send(dataToSend);
        else
        {
            const sockets = Array.from(this.clients.values());
            
            for(const socket of sockets)
            {
                socket.send(dataToSend);
            }
        }
    }
}