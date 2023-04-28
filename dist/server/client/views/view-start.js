/**
 * View responsible for the start screen
 */
export class ViewStart {
    //Controller resposible for the game
    controllerGame;
    /**
     * Constructor
     * @param { ControllerGame} controllerGame Controller responsible for the game
     */
    constructor(controllerGame) {
        this.controllerGame = controllerGame;
        this.controllerGame.addObserver(this);
    }
    /**
     * Notifies the view to refresh
     */
    notify() {
        if (this.controllerGame.playerName === null)
            this.display();
        else
            this.hide();
    }
    /**
     * Displays the start screen
     */
    display() {
        if (document.querySelector(".dialog-background") === null) {
            const dialog = document.createElement('div');
            dialog.classList.add("dialog-background");
            dialog.innerHTML = `
                <div class="dialog-window">
                    <h1>BlackHole.IO</h1>
                    <input type="text" id="txt-player-name" placeholder="Votre nom">
                    <button id="btn-start-game">Start</button>
                </div>
            `;
            document.body.append(dialog);
            document.querySelector("#btn-start-game")?.addEventListener("click", () => {
                this.controllerGame.newGame(document.querySelector("#txt-player-name")?.value ?? "");
            });
        }
    }
    /**
     * Hides the start screen
     */
    hide() {
        document.querySelector(".dialog-background")?.remove();
    }
}
