"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackHoleGame = void 0;
const black_hole_js_1 = require("./black-hole.js");
const coordinate_js_1 = require("./coordinate.js");
const universe_js_1 = require("./universe.js");
const vector_js_1 = require("./vector.js");
/**
 * Represents the core of the game
 */
class BlackHoleGame {
    /**
     * Constructor
     */
    constructor() {
        this._universe = null;
        this._blackholes = new Map();
    }
    get universe() { return this._universe; }
    ;
    get blackholes() { return this._blackholes; }
    ;
    get playersCount() { return this.blackholes.size; }
    ;
    /**
     * Prepares a new game
     * @param {number} width max width of the universe
     * @param {number } height max height of the universe
     */
    newGame(width, height) {
        this._universe = new universe_js_1.Universe(width, height);
        this._blackholes.clear();
    }
    /**
     * Adds new player to the game
     * @param {string} playerName Name of the player
     */
    addPlayer(playerName) {
        const blackhole = new black_hole_js_1.BlackHole({
            name: playerName,
            color: `hsl(${Math.random() * 360}, 60%, 60%)`,
            coordinate: this.getRandomCoordinate().toData(),
            direction: this.getRandomDirection().toData(),
            speed: black_hole_js_1.BlackHole.DEFAULT_SPEED,
            radius: black_hole_js_1.BlackHole.DEFAULT_RADIUS,
            attractionVectors: []
        });
        this.addBlackholes([blackhole]);
    }
    /**
     * Generates random coordinate
     * @returns {Coordinate} Randomly generated coordinate
     */
    getRandomCoordinate() {
        var _a, _b, _c, _d;
        return new coordinate_js_1.Coordinate({
            x: Math.floor(Math.random() * ((_b = (_a = this.universe) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0)),
            y: Math.floor(Math.random() * ((_d = (_c = this.universe) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0))
        });
    }
    /**
     * Generates random vector
     * @returns { Vector } Randomly generated vector
     */
    getRandomDirection() {
        const point = new coordinate_js_1.Coordinate({ x: 1, y: 0 });
        point.rotate(new coordinate_js_1.Coordinate(), Math.random() * Math.PI * 2);
        return new vector_js_1.Vector({
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
        var _a;
        (_a = this.blackholes.get(name)) === null || _a === void 0 ? void 0 : _a.moveTo(coordinate);
    }
}
exports.BlackHoleGame = BlackHoleGame;
