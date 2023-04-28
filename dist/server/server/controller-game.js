"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerGame = void 0;
const black_hole_game_1 = require("../common/black-hole-game");
class ControllerGame {
    constructor(server) {
        this.server = server;
        this.game = new black_hole_game_1.BlackHoleGame();
        this.game.newGame(300, 200);
        this.lastUpdate = 0;
        this.initServerEvents();
    }
    initServerEvents() {
        this.server.addEventListener("new player", (socketId, data) => { this.addPlayerToGame(socketId, data); });
        this.server.addEventListener("player sync", (socketId, data) => { this.syncPlayer(socketId, data); });
    }
    addPlayerToGame(socketId, playerName) {
        var _a;
        if (this.game.playersCount >= 10)
            throw "No more space available";
        this.game.addPlayer(playerName);
        console.log(`Player ${playerName} added.`);
        this.updateGame();
        const players = Array.from(this.game.blackholes.values());
        this.server.emit("world sync", JSON.stringify({
            game: (_a = this.game.universe) === null || _a === void 0 ? void 0 : _a.toData(),
            players: players.map((player) => { return player.toData(); })
        }), socketId);
        this.server.emit("new player", JSON.stringify({
            player: this.game.getBlackhole(playerName).toData()
        }));
    }
    syncPlayer(socketId, jsondata) {
        var _a;
        try {
            const data = JSON.parse(jsondata);
            (_a = this.game.getBlackhole(data.player.name)) === null || _a === void 0 ? void 0 : _a.fromData(data.player);
            this.updateGame();
            this.server.emit("player sync", JSON.stringify({
                player: data.player
            }));
        }
        catch (e) {
            console.trace(e);
        }
    }
    updateGame() {
        if (this.lastUpdate !== 0) {
            this.game.update(performance.now() - this.lastUpdate);
        }
        this.lastUpdate = performance.now();
    }
}
exports.ControllerGame = ControllerGame;
