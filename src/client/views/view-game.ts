import { BlackHole } from "../../common/black-hole.js";
import { Coordinate } from "../../common/coordinate.js";
import { ControllerGame } from "../controllers/controller-game.js";
import { Observer } from "../models/observer.js";

/**
 * View responsible for the displaying of the game
 */
export class ViewGame implements Observer
{
    //Controller responsible for the game
    private controllerGame: ControllerGame;

    //Canves used to render the scene
    private readonly canvas: HTMLCanvasElement;

    //2D Context used to render the scene
    private readonly ctx: CanvasRenderingContext2D;

    //Time of the last update
    private lastUpdate: number | null;

    /**
     * Constructor
     * @param { ControllerGame} controllerGame Controller responsible for the game 
     */
    constructor(controllerGame: ControllerGame)
    {
        this.lastUpdate = null;

        this.controllerGame = controllerGame;
        this.controllerGame.addObserver(this);

        this.canvas = document.querySelector("canvas")!;
        this.ctx = this.canvas.getContext("2d")!;

        this.initMainEvents();

        this.resize();

        this.update();
    }

    /**
     * Initializes main events of the view
     */
    private initMainEvents()
    {
        window.addEventListener("resize", () => { this.resize(); });

        this.canvas.addEventListener("click", (event) => 
        {
            this.movePlayerToMousePointer(event);
        })
    }

    /**
     * Notifies the view to refresh
     */
    notify()
    {
        if (this.controllerGame.playerName)
            this.draw();
    }

    /**
     * Resize the canvas of the view
     */
    private resize()
    {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.draw();
    }

    /**
     * Directs the player to the coordinates of the mouse
     * @param {MouseEvent} event Event produced by the mouse on move 
     */
    private movePlayerToMousePointer(event: MouseEvent)
    {
        const playerName = this.controllerGame.playerName;

        if (!playerName)
            return;

        try
        {
            const player = this.controllerGame.getPlayer();

            this.controllerGame.movePlayer(new Coordinate({
                x: player.coordinate.x + event.clientX - this.canvas.width / 2,
                y: player.coordinate.y + event.clientY - this.canvas.height / 2
            }))
        }
        catch (e)
        {
            //console.trace(e);
        }
    }

    /**
     * Updates the scene of the game
     */
    private update()
    {
        if (this.controllerGame.playerName !== null)
        {
            if (this.lastUpdate)
            {
                const elapsedTime = performance.now() - this.lastUpdate;
                this.lastUpdate = performance.now();

                this.controllerGame.game.update(elapsedTime);
            }
            else
                this.lastUpdate = performance.now();


            this.draw();

        }

        requestAnimationFrame(() =>
        {
            this.update();
        });
    }

    /**
     * Draws the scene
     */
    private draw()
    {
        try
        {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.save();
            this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

            this.drawBackground();
            this.drawBlackHoles();

            this.ctx.restore();
        }
        catch (e)
        {
            console.trace(e);
        }
    }

    /**
     * Draws the background of the scene 
     */
    private drawBackground()
    {
        try
        {
            const player = this.controllerGame.getPlayer();
            const center = player.coordinate;

            const top = center.y - this.canvas.height / 2;
            const left = center.x - this.canvas.width / 2;

            const topCanvas = -this.canvas.height / 2;
            const bottomCanvas = topCanvas + this.canvas.height;
            const leftCanvas = -this.canvas.width / 2;
            const rightCanvas = leftCanvas + this.canvas.width;

            const gridGap = 300;

            let x = leftCanvas + gridGap - left % gridGap;
            let y = topCanvas + gridGap - top % gridGap;

            this.ctx.strokeStyle = "#222";

            while (y < bottomCanvas)
            {
                this.ctx.beginPath();
                this.ctx.moveTo(leftCanvas, y);
                this.ctx.lineTo(rightCanvas, y);
                this.ctx.stroke();

                y += gridGap;
            }

            while (x < rightCanvas)
            {
                this.ctx.beginPath();
                this.ctx.moveTo(x, topCanvas);
                this.ctx.lineTo(x, bottomCanvas);
                this.ctx.stroke();

                x += gridGap;
            }
        }
        catch (e)
        {

        }
    }

    /**
     * Draws blackholes on the canvas 
     */
    private drawBlackHoles()
    {
        try
        {
            const player = this.controllerGame.getPlayer();
            const center = player.coordinate;

            this.controllerGame.game.blackholes.forEach((blackhole) =>
            {
                this.drawBlackHole(blackhole, center);
            });
        }
        catch (e)
        {

        }
    }

    /**
     * Draws the given blackhole
     * @param {BlackHole} blackhole BlackHole to draw 
     * @param {Coordinate} center Center of the scene
     */
    private drawBlackHole(blackhole: BlackHole, center: Coordinate)
    {
        const x = Math.floor(blackhole.coordinate.x - center.x);
        const y = Math.floor(blackhole.coordinate.y - center.y);

        const gradient = this.ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            blackhole.radius,
        );

        gradient.addColorStop(0, "#000");
        gradient.addColorStop(0.7, "#000");
        gradient.addColorStop(1, blackhole.color);

        this.ctx.fillStyle = gradient;

        this.ctx.beginPath();

        this.ctx.arc(
            x,
            y,
            Math.floor(blackhole.radius),
            0,
            Math.PI * 2);
        this.ctx.fill();

        const str = `${blackhole.name} - ${blackhole.coordinate.x.toFixed(0)} ; ${blackhole.coordinate.y.toFixed(0)}`
        const { width } = this.ctx.measureText(str);
        this.ctx.fillStyle = blackhole.color;
        this.ctx.fillText(str, x - width / 2, y - blackhole.radius - 10);
    }
}