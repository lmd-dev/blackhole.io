import { Coordinate } from "../../common/coordinate.js";
/**
 * View responsible for the displaying of the game
 */
export class ViewGame {
    //Controller responsible for the game
    controllerGame;
    //Canves used to render the scene
    canvas;
    //2D Context used to render the scene
    ctx;
    //Time of the last update
    lastUpdate;
    /**
     * Constructor
     * @param { ControllerGame} controllerGame Controller responsible for the game
     */
    constructor(controllerGame) {
        this.lastUpdate = null;
        this.controllerGame = controllerGame;
        this.controllerGame.addObserver(this);
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.initMainEvents();
        this.resize();
        this.update();
    }
    /**
     * Initializes main events of the view
     */
    initMainEvents() {
        window.addEventListener("resize", () => { this.resize(); });
        this.canvas.addEventListener("mousemove", (event) => {
            this.movePlayerToMousePointer(event);
        });
    }
    /**
     * Notifies the view to refresh
     */
    notify() {
        if (this.controllerGame.playerName)
            this.draw();
    }
    /**
     * Resize the canvas of the view
     */
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.draw();
    }
    /**
     * Directs the player to the coordinates of the mouse
     * @param {MouseEvent} event Event produced by the mouse on move
     */
    movePlayerToMousePointer(event) {
        const playerName = this.controllerGame.playerName;
        if (!playerName)
            return;
        try {
            const player = this.controllerGame.getPlayer();
            this.controllerGame.movePlayer(new Coordinate({
                x: player.coordinate.x + event.clientX - this.canvas.width / 2,
                y: player.coordinate.y + event.clientY - this.canvas.height / 2
            }));
        }
        catch (e) {
            //console.trace(e);
        }
    }
    /**
     * Updates the scene of the game
     */
    update() {
        if (this.controllerGame.playerName !== null) {
            if (this.lastUpdate) {
                const elapsedTime = performance.now() - this.lastUpdate;
                this.controllerGame.game.update(elapsedTime);
            }
            this.draw();
            this.lastUpdate = performance.now();
        }
        requestAnimationFrame(() => {
            this.update();
        });
    }
    /**
     * Draws the scene
     */
    draw() {
        try {
            const player = this.controllerGame.getPlayer();
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.lineWidth = 2;
            const blackholes = this.controllerGame.game.blackholes;
            const center = player.coordinate;
            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
            blackholes.forEach((blackhole) => {
                this.drawBlackHole(blackhole, center);
            });
            this.ctx.restore();
        }
        catch (e) {
            //console.trace(e);
        }
    }
    /**
     * Draws the given blackhole
     * @param {BlackHole} blackhole BlackHole to draw
     * @param {Coordinate} center Center of the scene
     */
    drawBlackHole(blackhole, center) {
        this.ctx.strokeStyle = blackhole.color;
        const x = Math.floor(blackhole.coordinate.x - center.x);
        const y = Math.floor(blackhole.coordinate.y - center.y);
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, blackhole.radius);
        gradient.addColorStop(0, "#000");
        gradient.addColorStop(0.7, "#000");
        gradient.addColorStop(1, "#FFF");
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, Math.floor(blackhole.radius), 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        const { width } = this.ctx.measureText(blackhole.name);
        this.ctx.fillStyle = "#000";
        this.ctx.fillText(blackhole.name, x - width / 2, y - blackhole.radius - 10);
    }
}
