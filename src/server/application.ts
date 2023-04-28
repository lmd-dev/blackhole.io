import { ControllerGame } from "./controller-game";
import { Server } from "./server";

export class Application
{
    //Webserver used by the application
    private server: Server;

    //Controller responsible for the game
    private controllerGame: ControllerGame;

    /**
     * Constructor
     */
    constructor()
    {
        this.server = new Server();
        this.controllerGame = new ControllerGame(this.server);

        this.server.listen()
    }
}