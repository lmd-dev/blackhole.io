/**
 * Represents a coordinate
 */
export class Coordinate {
    //X coordinate
    _x;
    get x() { return this._x; }
    ;
    set x(value) { this._x = value; }
    //Y coordinate
    _y;
    get y() { return this._y; }
    ;
    set y(value) { this._y = value; }
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
    /**
     * Imports data from JS Object
     * @param {CoordinateData} data Data to import
     */
    fromData(data) {
        this._x = data.x ?? this._x;
        this._y = data.y ?? this._y;
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
