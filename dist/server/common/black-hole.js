"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlackHole = void 0;
const coordinate_js_1 = require("./coordinate.js");
const vector_js_1 = require("./vector.js");
/**
 * Represents a blackhole
 */
class BlackHole {
    /**
     * Constructor
     * @param {BlackHoleData} data Initialization data
     */
    constructor(data) {
        this._name = data.name;
        this._color = data.color;
        this._coordinate = new coordinate_js_1.Coordinate(data.coordinate);
        this._direction = new vector_js_1.Vector(data.direction);
        this._direction.normalize();
        this._speed = data.speed;
        this._attractionVectors = [];
        this._radius = data.radius;
    }
    get name() { return this._name; }
    ;
    get color() { return this._color; }
    ;
    get coordinate() { return this._coordinate; }
    ;
    get direction() { return this._direction; }
    ;
    get speed() { return this._speed; }
    ;
    get attractionVectors() { return this._attractionVectors; }
    ;
    get radius() { return this._radius; }
    ;
    /**
     * Imports data from JS Object
     * @param {BlackHoleData} data Data to import
     */
    fromData(data) {
        var _a, _b, _c, _d, _e, _f;
        this._name = (_a = data.name) !== null && _a !== void 0 ? _a : this._name;
        this._color = (_b = data.color) !== null && _b !== void 0 ? _b : this._color;
        if (data.coordinate)
            this._coordinate.fromData(data.coordinate);
        if (data.direction)
            this._direction.fromData(data.direction);
        this._speed = (_c = data.speed) !== null && _c !== void 0 ? _c : this._speed;
        this._radius = (_d = data.radius) !== null && _d !== void 0 ? _d : this._radius;
        this._attractionVectors.length = 0;
        this._attractionVectors.push(...(_f = (_e = data.attractionVectors) === null || _e === void 0 ? void 0 : _e.map((vector) => { return new vector_js_1.Vector(vector); })) !== null && _f !== void 0 ? _f : []);
    }
    /**
     * Exports data to JS object
     * @returns {BlackHoleData} Exported data
     */
    toData() {
        return {
            name: this.name,
            color: this.color,
            coordinate: this.coordinate.toData(),
            direction: this.direction.toData(),
            speed: this.speed,
            radius: this.radius,
            attractionVectors: this._attractionVectors.map((vector) => { return vector.toData(); })
        };
    }
    /**
     * Updates the position of the blackhole
     * @param {number} elapsedTime Elapsed time from the last update
     */
    update(elapsedTime) {
        this.coordinate.move(this._direction.scale(elapsedTime * this.speed));
    }
    /**
     * Directs the blachole to the given coordinate
     * @param {Coordinate} coordinate Coordinate to direct the blackhole to
     */
    moveTo(coordinate) {
        this.direction.vx = coordinate.x - this._coordinate.x;
        this.direction.vy = coordinate.y - this._coordinate.y;
        this.direction.normalize();
    }
    /**
     * Absorbs another blachole
     * @param {BlackHole} blackhole Blackhole to absorb
     */
    absorb(blackhole) {
        this._radius = Math.sqrt(Math.pow(this.radius, 2) + Math.pow(blackhole.radius, 2));
    }
}
exports.BlackHole = BlackHole;
//Default radius of a Blackhole
BlackHole.DEFAULT_RADIUS = 15;
//Default speed of a Blackhole
BlackHole.DEFAULT_SPEED = 0.05;
