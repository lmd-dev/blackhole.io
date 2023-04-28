import { BlackHoleGame } from "../common/black-hole-game";
import { Server } from "./server";

/**
 * Constroller responsible for the game
 */
export class ControllerGame
{
    //WebServer to use to communicate with the clients
    private server: Server;

    //Game
    private game: BlackHoleGame;

    //When the game has been updated last
    private lastUpdate: number;

    /**
     * Constructor
     * @param {Server} server WebServer to use to communicate with the clients 
     */
    public constructor(server: Server)
    {
        this.server = server;
        this.game = new BlackHoleGame();
        this.game.newGame(300, 200);
        this.lastUpdate = 0;

        this.initWebSocketServerEvents();
    }

    /**
     * Initializes websocket events
     */
    public initWebSocketServerEvents()
    {
        this.server.addEventListener("new player", (socketId, data) => { this.addPlayerToGame(socketId, data) });
        this.server.addEventListener("player sync", (socketId, data) => { this.syncPlayer(socketId, data) });
    }

    /**
     * Adds new player to the game
     * @param { number } socketId ID of the client socket 
     * @param { string } playerName NAme of the new player 
     */
    private addPlayerToGame(socketId: number, playerName: string)
    {
        if(this.game.playersCount >= 10)
            throw "No more space available";

        this.game.addPlayer(playerName);

        console.log(`Player ${playerName} added.`);

        this.updateGame();

        const players = Array.from(this.game.blackholes.values());

        this.server.emit("world sync", JSON.stringify({
            game: this.game.universe?.toData(),
            players: players.map((player) => { return player.toData() })
        }), socketId);

        this.server.emit("new player", JSON.stringify({
            player: this.game.getBlackhole(playerName).toData()
        }))
    }

    /**
     * Synchronizes player data
     * @param {number} socketId Id of the client socket of the player to synchronize 
     * @param {string} jsondata JSON formated data about the player 
     */
    private syncPlayer(socketId: number, jsondata)
    {
        try {
            const data = JSON.parse(jsondata);

            this.game.getBlackhole(data.player.name)?.fromData(data.player);

            this.updateGame();

            this.server.emit("player sync", JSON.stringify({
                player: data.player
            }));
        }
        catch(e)
        {
            console.trace(e);
        }
    }

    /**
     * Updates the game
     */
    private updateGame()
    {
        if(this.lastUpdate !== 0)
        {
            this.game.update(performance.now() - this.lastUpdate);
        }

        this.lastUpdate = performance.now();
    }
}