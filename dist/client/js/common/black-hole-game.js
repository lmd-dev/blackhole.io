import { BlackHole } from "./black-hole.js";
import { Coordinate } from "./coordinate.js";
import { Universe } from "./universe.js";
import { Vector } from "./vector.js";
/**
 * Represents the core of the game
 */
export class BlackHoleGame {
    //Game board of the game
    _universe;
    get universe() { return this._universe; }
    ;
    //List of the blackholes in game
    _blackholes;
    get blackholes() { return this._blackholes; }
    ;
    get playersCount() { return this.blackholes.size; }
    ;
    /**
     * Constructor
     */
    constructor() {
        this._universe = null;
        this._blackholes = new Map();
    }
    /**
     * Prepares a new game
     * @param {number} width max width of the universe
     * @param {number } height max height of the universe
     */
    newGame(width, height) {
        this._universe = new Universe(width, height);
        this._blackholes.clear();
    }
    /**
     * Adds new player to the game
     * @param {string} playerName Name of the player
     */
    addPlayer(playerName) {
        const blackhole = new BlackHole({
            name: playerName,
            color: `hsl(${Math.random() * 360}, 60%, 60%)`,
            coordinate: this.getRandomCoordinate().toData(),
            direction: this.getRandomDirection().toData(),
            speed: BlackHole.DEFAULT_SPEED,
            radius: BlackHole.DEFAULT_RADIUS,
            attractionVectors: []
        });
        this.addBlackholes([blackhole]);
    }
    /**
     * Generates random coordinate
     * @returns {Coordinate} Randomly generated coordinate
     */
    getRandomCoordinate() {
        return new Coordinate({
            x: Math.floor(Math.random() * (this.universe?.width ?? 0)),
            y: Math.floor(Math.random() * (this.universe?.height ?? 0))
        });
    }
    /**
     * Generates random vector
     * @returns { Vector } Randomly generated vector
     */
    getRandomDirection() {
        const point = new Coordinate({ x: 1, y: 0 });
        point.rotate(new Coordinate(), Math.random() * Math.PI * 2);
        return new Vector({
            vx: point.x,
            vy: point.y
        });
    }
    /**
     * Adds blackholes to the universe of the game
     * @param {BlackHole[]} blackholes Array of blackholes to add
     */
    addBlackholes(blackholes) {
        blackholes.forEach((blackhole) => {
            this.blackholes.set(blackhole.name, blackhole);
        });
    }
    /**
     * Gets a blackhole from its name
     * @param {string} name Name of the searched blackhole
     * @returns The found blackhole else throw an exception
     */
    getBlackhole(name) {
        const blackhole = this.blackholes.get(name);
        if (blackhole)
            return blackhole;
        throw `BlackHoleGame::getBlackHole - Unknown blackhole '${name}'`;
    }
    /**
     * Updates the game
     * @param {number} elapsedTime Elampsed time from the last update
     */
    update(elapsedTime) {
        this.blackholes.forEach((blackhole) => {
            blackhole.update(elapsedTime);
        });
        const array = Array.from(this.blackholes.values());
        for (let iBlackhole = 0; iBlackhole < array.length - 1; ++iBlackhole) {
            const first = array[iBlackhole];
            for (let iNext = iBlackhole + 1; iNext < array.length; ++iNext) {
                const second = array[iNext];
                if (first.radius == second.radius) {
                    continue;
                }
                else if (first.radius > second.radius) {
                    if (first.coordinate.distance(second.coordinate) < first.radius) {
                        first.absorb(second);
                        this.blackholes.delete(second.name);
                        array.splice(iNext, 1);
                        --iNext;
                    }
                }
                else {
                    if (second.coordinate.distance(first.coordinate) < second.radius) {
                        second.absorb(first);
                        this.blackholes.delete(first.name);
                        array.splice(iBlackhole, 1);
                        --iBlackhole;
                        break;
                    }
                }
            }
        }
    }
    /**
     * Sets the new direction of the given blackhole
     * @param { name } name of the blckhole to direct
     * @param {Coordinate} coordinate Target to direct the blackhole to
     */
    setBlackholeDirection(name, coordinate) {
        this.blackholes.get(name)?.moveTo(coordinate);
    }
}
