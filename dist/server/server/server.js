"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const fastify_1 = require("fastify");
const websocket_1 = require("@fastify/websocket");
const static_1 = require("@fastify/static");
const path = require("path");
/**
 * Web server used by the application
 */
class Server {
    /**
     * Constructor
     */
    constructor() {
        this.events = new Map();
        this.clients = new Map();
        this.nextSocketId = 0;
        this.fastify = (0, fastify_1.default)();
        this.initStaticFiles();
        this.initAPIRoutes();
        this.initWebSocketRoutes();
    }
    /**
     * Initializes static files access
     */
    initStaticFiles() {
        this.fastify.register(static_1.default, {
            root: path.join(__dirname, "..", "..", "client")
        });
    }
    /**
     * Initailizes routes for the available server API
     */
    initAPIRoutes() {
        this.fastify.get("/api/websocket-url", (request, reply) => {
            reply.send(`ws://localhost:${this.getPort()}/ws`);
        });
    }
    /**
     * Initializes WebSocket routes
     */
    initWebSocketRoutes() {
        this.fastify.register(websocket_1.default);
        this.fastify.register((fastify) => __awaiter(this, void 0, void 0, function* () {
            fastify.get('/ws', { websocket: true }, (connection, req) => {
                const socketId = ++this.nextSocketId;
                this.clients.set(socketId, connection.socket);
                connection.socket.on('message', (message) => {
                    this.processMessage(socketId, message.toLocaleString());
                });
            });
        }));
    }
    /**
     * Starts the server listening
     */
    listen() {
        const port = this.getPort();
        this.fastify.listen({ port }, (error) => {
            if (error) {
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
    getPort() {
        var _a;
        return parseInt((_a = process.env.WEBSERVER_PORT) !== null && _a !== void 0 ? _a : "80");
    }
    /**
     * Adds an event handler on a type of message from clients
     * @param { string } type Type of message which will trigger the event
     * @param { EventCallback } callback Function to call when the event is triggered
     */
    addEventListener(type, callback) {
        this.events.set(type, callback);
    }
    /**
     * Processes websocket message from clients
     * @param { socketId } Id of the client socket
     * @param { message } Message sended by the client
     */
    processMessage(socketId, message) {
        var _a;
        try {
            const messageData = JSON.parse(message);
            (_a = this.events.get(messageData.type)) === null || _a === void 0 ? void 0 : _a(socketId, messageData.data);
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Emits a message to connected clients
     * @param { string } type Type of the message
     * @param { string } data Data to send
     * @param { socketId }Id of the client socket to send the message. If equal to 0, sends the message to all the connected clients (broadcast)
     */
    emit(type, data, socketId = 0) {
        var _a;
        const message = { type, data };
        const dataToSend = JSON.stringify(message);
        if (socketId !== 0)
            (_a = this.clients.get(socketId)) === null || _a === void 0 ? void 0 : _a.send(dataToSend);
        else {
            const sockets = Array.from(this.clients.values());
            for (const socket of sockets) {
                socket.send(dataToSend);
            }
        }
    }
}
exports.Server = Server;
