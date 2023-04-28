"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const controller_game_1 = require("./controller-game");
const server_1 = require("./server");
class Application {
    constructor() {
        this.server = new server_1.Server();
        this.controllerGame = new controller_game_1.ControllerGame(this.server);
        this.server.listen();
    }
}
exports.Application = Application;
