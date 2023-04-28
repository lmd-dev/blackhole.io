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
class Server {
    constructor() {
        this.events = new Map();
        this.clients = new Map();
        this.nextSocketId = 0;
        this.fastify = (0, fastify_1.default)();
        this.fastify.register(websocket_1.default);
        this.fastify.register((fastify) => __awaiter(this, void 0, void 0, function* () {
            fastify.get('/', { websocket: true }, (connection, req) => {
                const socketId = ++this.nextSocketId;
                this.clients.set(socketId, connection.socket);
                connection.socket.on('message', (message) => {
                    this.processMessage(socketId, message.toLocaleString());
                });
            });
        }));
    }
    listen() {
        this.fastify.listen({ port: 3000 }, () => {
            console.log("Server is listening !");
        });
    }
    addEventListener(type, callback) {
        this.events.set(type, callback);
    }
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
