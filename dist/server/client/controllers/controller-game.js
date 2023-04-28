import { BlackHole, BlackHoleGame } from "../../../common";
import { Notifier } from "../models/notifier.js";
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
        this.connect();
    }
    /**
     * Starts a new game
     * @param {string} playerName NAme of the local player
     */
    newGame(playerName) {
        if (playerName === "")
            return;
        this._playerName = playerName;
        this.game.newGame(1000, 1000);
        const players = [
            new BlackHole({
                name: playerName,
                color: "#4691FF",
                coordinate: { x: 0, y: 0 },
                direction: { vx: 1, vy: 0 },
                speed: 0.05,
                radius: BlackHole.DEFAULT_RADIUS
            })
        ];
        for (let i = 0; i < 10; ++i) {
            const name = (i + 2).toString();
            players.push(new BlackHole({
                name: name,
                color: "#FF8800",
                coordinate: {
                    x: Math.floor(Math.random() * 500),
                    y: Math.floor(Math.random() * 200)
                },
                direction: { vx: 0, vy: 0 },
                speed: 0,
                radius: BlackHole.DEFAULT_RADIUS / 2
            }));
        }
        this.game.addBlackholes(players);
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
    }
    connect() {
        const socket = new WebSocket("ws://localhost:3000");
        console.log(socket);
        socket.addEventListener("open", () => {
            console.log("connection OK");
            socket.send("test");
        });
    }
}
