import { BlackHoleGame } from "../../common/black-hole-game.js";
import { BlackHole } from "../../common/black-hole.js";
import { Notifier } from "../models/notifier.js";
import { serviceWebSocket } from "../service/service-websocket.js";
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
        this.initEvents();
    }
    initEvents() {
        serviceWebSocket.addEventListener("world sync", (data) => { this.synchronizeWorld(data); });
        serviceWebSocket.addEventListener("new player", (data) => { this.addPlayer(data); });
        serviceWebSocket.addEventListener("player sync", (data) => { this.synchronizePlayer(data); });
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
        serviceWebSocket.emit("player sync", JSON.stringify({
            player: this.game.getBlackhole(this.playerName).toData()
        }));
    }
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
    synchronizePlayer(jsondata) {
        try {
            const data = JSON.parse(jsondata);
            const player = this.game.getBlackhole(data.player.name);
            player?.fromData(data.player);
            console.log(player);
            this.notify();
        }
        catch (e) {
            console.log(e);
        }
    }
}
;
