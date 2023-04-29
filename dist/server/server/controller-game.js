"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerGame = void 0;
const black_hole_game_1 = require("../common/black-hole-game");
/**
 * Constroller responsible for the game
 */
class ControllerGame {
    /**
     * Constructor
     * @param {Server} server WebServer to use to communicate with the clients
     */
    constructor(server) {
        this.server = server;
        this.game = new black_hole_game_1.BlackHoleGame();
        this.game.newGame(5000, 3000);
        this.lastUpdate = 0;
        this.initWebSocketServerEvents();
        setInterval(() => { this.syncCoordinates(); }, 1000);
    }
    /**
     * Initializes websocket events
     */
    initWebSocketServerEvents() {
        this.server.addEventListener("new player", (socketId, data) => { this.addPlayerToGame(socketId, data); });
        this.server.addEventListener("player sync", (socketId, data) => { this.syncPlayer(socketId, data); });
    }
    /**
     * Adds new player to the game
     * @param { number } socketId ID of the client socket
     * @param { string } playerName NAme of the new player
     */
    addPlayerToGame(socketId, playerName) {
        var _a;
        if (this.game.playersCount >= 10)
            throw "No more space available";
        this.game.addPlayer(playerName);
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
    /**
     * Synchronizes player data
     * @param {number} socketId Id of the client socket of the player to synchronize
     * @param {string} jsondata JSON formated data about the player
     */
    syncPlayer(socketId, jsondata) {
        try {
            const data = JSON.parse(jsondata);
            this.updateGame();
            const player = this.game.getBlackhole(data.playerName);
            player.direction.fromData(data.direction);
            this.server.emit("sync player direction", JSON.stringify(data));
        }
        catch (e) {
            console.trace(e);
        }
    }
    /**
     * Updates the game
     */
    updateGame() {
        if (this.lastUpdate !== 0) {
            this.game.update(performance.now() - this.lastUpdate);
        }
        this.lastUpdate = performance.now();
    }
    /**
     * Synchronizes all players coordinates with clients
     */
    syncCoordinates() {
        this.updateGame();
        const coordinates = Array.from(this.game.blackholes.values()).map((blackhole) => {
            return {
                playerName: blackhole.name,
                coordinate: blackhole.coordinate.toData()
            };
        });
        this.server.emit("sync players coordinates", JSON.stringify(coordinates));
    }
}
exports.ControllerGame = ControllerGame;
