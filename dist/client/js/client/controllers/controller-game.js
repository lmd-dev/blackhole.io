import { BlackHoleGame } from "../../common/black-hole-game.js";
import { BlackHole } from "../../common/black-hole.js";
import { Notifier } from "../models/notifier.js";
import { serviceWebSocket } from "../service/service-websocket.js";
/**
 * Controller responsible for the game
 */
export class ControllerGame extends Notifier {
    //Game core
    _game;
    get game() { return this._game; }
    ;
    //Name of the local player
    _playerName;
    get playerName() { return this._playerName; }
    ;
    /**
     * Constructor
     */
    constructor() {
        super();
        this._playerName = null;
        this._game = new BlackHoleGame();
        this.initWebSocketEvents();
    }
    /**
     * Initializes WebSocket events from server
     */
    initWebSocketEvents() {
        serviceWebSocket.addEventListener("world sync", (data) => { this.synchronizeWorld(data); });
        serviceWebSocket.addEventListener("new player", (data) => { this.addPlayer(data); });
        serviceWebSocket.addEventListener("sync player direction", (data) => { this.synchronizePlayerDirection(data); });
        serviceWebSocket.addEventListener("sync players coordinates", (data) => { this.synchronizePlayersCoordinates(data); });
    }
    /**
     * Starts a new game
     * @param {string} playerName NAme of the local player
     */
    newGame(playerName) {
        if (playerName === "")
            return;
        this._playerName = playerName;
        serviceWebSocket.emit("new player", playerName);
        this.notify();
    }
    /**
     * Gets local player's Blackhole
     * @returns { BlackHole } Returns the BlackHole controlled by the player
     */
    getPlayer() {
        return this.game.getBlackhole(this.playerName ?? "");
    }
    /**
     * Directs the player to the given coordinates
     * @param {Coordinate} target: Coordinate to direct the player to
     */
    movePlayer(target) {
        if (!this.playerName)
            return;
        this.game.setBlackholeDirection(this.playerName, target);
        const player = this.game.getBlackhole(this.playerName);
        serviceWebSocket.emit("player sync", JSON.stringify({
            playerName: player.name,
            direction: player.direction.toData()
        }));
    }
    /**
     * Synchronizes the game from server
     * @param {string} jsondata JSON formated data sended from the server to initialize the game
     */
    synchronizeWorld(jsondata) {
        try {
            const data = JSON.parse(jsondata);
            this.game.newGame(data.game.width, data.game.height);
            this.game.addBlackholes(data.players.map((player) => {
                return new BlackHole(player);
            }));
            this.notify();
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Adds a new remote player to the game
     * @param {string} jsondata JSON formated data about the new player
     */
    addPlayer(jsondata) {
        try {
            const data = JSON.parse(jsondata);
            this.game.addBlackholes([new BlackHole(data.player)]);
            this.notify();
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Synchronizes data of a player from the server
     * @param {string} jsondata JSON formated data about the player to synchronize
     */
    synchronizePlayerDirection(jsondata) {
        try {
            const data = JSON.parse(jsondata);
            if (data.playerName === this.playerName)
                return;
            const player = this.game.getBlackhole(data.playerName);
            player.direction.fromData(data.direction);
            this.notify();
        }
        catch (e) {
            console.log(e);
        }
    }
    synchronizePlayersCoordinates(jsondata) {
        try {
            const data = JSON.parse(jsondata);
            data.forEach((player) => {
                try {
                    const blackhole = this.game.getBlackhole(player.playerName);
                    blackhole.coordinate.fromData(player.coordinate);
                }
                catch (e) {
                }
            });
        }
        catch (e) {
        }
    }
}
;
