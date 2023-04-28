import { BlackHoleGame } from "../../common/black-hole-game.js"
import { BlackHole } from "../../common/black-hole.js"
import { Coordinate } from "../../common/coordinate.js"
import { Notifier } from "../models/notifier.js"
import { serviceWebSocket } from "../service/service-websocket.js";

/**
 * Controller responsible for the game
 */
export class ControllerGame extends Notifier
{
    //Game core
    private _game: BlackHoleGame;
    public get game(): BlackHoleGame { return this._game; };

    //Name of the local player
    private _playerName: string | null;
    public get playerName(): string | null { return this._playerName; };
    
    /**
     * Constructor
     */
    constructor()
    {
        super();

        this._playerName = null;
        this._game = new BlackHoleGame();

        this.initWebSocketEvents();
    }

    /**
     * Initializes WebSocket events from server
     */
    initWebSocketEvents()
    {
        serviceWebSocket.addEventListener("world sync", (data) => { this.synchronizeWorld(data); });
        serviceWebSocket.addEventListener("new player", (data) => { this.addPlayer(data); });
        serviceWebSocket.addEventListener("player sync", (data) => { this.synchronizePlayer(data); });
    }

    /**
     * Starts a new game
     * @param {string} playerName NAme of the local player  
     */
    newGame(playerName: string)
    {
        if(playerName === "")
            return;
        
        this._playerName = playerName;

        serviceWebSocket.emit("new player", playerName);

        this.notify();
    }

    /**
     * Gets local player's Blackhole
     * @returns { BlackHole } Returns the BlackHole controlled by the player
     */
    getPlayer(): BlackHole
    {
        return this.game.getBlackhole(this.playerName ?? "");
    }

    /**
     * Directs the player to the given coordinates
     * @param {Coordinate} target: Coordinate to direct the player to
     */
    movePlayer(target: Coordinate)
    {
        if(!this.playerName)
            return;        

        this.game.setBlackholeDirection(this.playerName, target);

        serviceWebSocket.emit("player sync", JSON.stringify({
            player: this.game.getBlackhole(this.playerName).toData()
        }));
    }

    /**
     * Synchronizes the game from server
     * @param {string} jsondata JSON formated data sended from the server to initialize the game 
     */
    private synchronizeWorld(jsondata: string)
    {
        try {
            const data = JSON.parse(jsondata);

            this.game.newGame(data.game.width, data.game.height);
            this.game.addBlackholes(data.players.map((player) => {
                return new BlackHole(player);
            }));
        
            this.notify();
        }
        catch(e)
        {
            console.log(e);
        }
    }

    /**
     * Adds a new remote player to the game
     * @param {string} jsondata JSON formated data about the new player 
     */
    private addPlayer(jsondata: string)
    {
        try {
            const data = JSON.parse(jsondata);

            this.game.addBlackholes([new BlackHole(data.player)]);
        
            this.notify();
        }
        catch(e)
        {
            console.log(e);
        }
    }

    /**
     * Synchronizes data of a player from the server
     * @param {string} jsondata JSON formated data about the player to synchronize 
     */
    private synchronizePlayer(jsondata: string)
    {
        try {
            const data = JSON.parse(jsondata);

            const player = this.game.getBlackhole(data.player.name);
            player?.fromData(data.player);

            console.log(player);
        
            this.notify();
        }
        catch(e)
        {
            console.log(e);
        }
    }
};