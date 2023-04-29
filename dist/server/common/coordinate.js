"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordinate = void 0;
/**
 * Represents a coordinate
 */
class Coordinate {
    /**
     * Constructor
     * @param {CoordinateData} data Initialization data
     */
    constructor(data = null) {
        this._x = 0;
        this._y = 0;
        if (data)
            this.fromData(data);
    }
    get x() { return this._x; }
    ;
    set x(value) { this._x = value; }
    get y() { return this._y; }
    ;
    set y(value) { this._y = value; }
    /**
     * Imports data from JS Object
     * @param {CoordinateData} data Data to import
     */
    fromData(data) {
        var _a, _b;
        this._x = (_a = data.x) !== null && _a !== void 0 ? _a : this._x;
        this._y = (_b = data.y) !== null && _b !== void 0 ? _b : this._y;
    }
    /**
     * Exports data to JS object
     * @returns {CoordinateData} Exported data
     */
    toData() {
        return {
            x: this.x,
            y: this.y
        };
    }
    /**
     * Moves the coordinate from the given vector
     * @param {Vector} vector Translation vector
     */
    move(vector) {
        this._x += vector.vx;
        this._y += vector.vy;
    }
    rotate(origin, angle) {
        const xFromOrigin = this.x - origin.x;
        const yFromOrigin = this.y - origin.y;
        const xTemp = xFromOrigin * Math.cos(angle) - yFromOrigin * Math.sin(angle);
        const yTemp = xFromOrigin * Math.sin(angle) + yFromOrigin * Math.cos(angle);
        this.x = xTemp + origin.x;
        this.y = yTemp + origin.y;
    }
    /**
     * Gets the distance from the given coordinate
     * @param {Coordinate} coordinate Coordinate from wich to measure the distance
     * @returns {number}The mesuared distance
     */
    distance(coordinate) {
        return Math.sqrt(Math.pow(this.x - coordinate.x, 2) + Math.pow(this.y - coordinate.y, 2));
    }
}
exports.Coordinate = Coordinate;
