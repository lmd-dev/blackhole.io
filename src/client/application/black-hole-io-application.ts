import { ControllerGame } from "../controllers/controller-game.js";
import { ViewGame } from "../views/view-game.js";
import { ViewStart } from "../views/view-start.js";

export class BlackHoleIOApplication
{
    //Controller responsible for the game
    private readonly controllerGame: ControllerGame;

    //View responsible for displaying the game
    private readonly viewGame: ViewGame;

    //View responsible for displaying start screen
    private readonly viewStart: ViewStart;

    /**
     * Constructor
     */
    constructor()
    {
        this.controllerGame = new ControllerGame();
        this.viewGame = new ViewGame(this.controllerGame);
        this.viewStart = new ViewStart(this.controllerGame);

        this.controllerGame.notify();
    }
}