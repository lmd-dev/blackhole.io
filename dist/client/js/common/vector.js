/**
 * Represents a vector
 */
export class Vector {
    //X coordinate of the vector
    _vx;
    get vx() { return this._vx; }
    ;
    set vx(value) { this._vx = value; }
    //Y coordinate of the vector
    _vy;
    get vy() { return this._vy; }
    ;
    set vy(value) { this._vy = value; }
    /**
     * Constructor
     * @param {VectorData} data Initialization Data
     */
    constructor(data = null) {
        this._vx = 0;
        this._vy = 0;
        if (data)
            this.fromData(data);
    }
    /**
     * Imports data from JS Object
     * @param {VectorData} data Data to import
     */
    fromData(data) {
        this._vx = data.vx ?? this._vx;
        this._vy = data.vy ?? this._vy;
    }
    /**
     * Exports data to JS object
     * @returns {VectorData} Exported data
     */
    toData() {
        return {
            vx: this.vx,
            vy: this.vy
        };
    }
    /**
     * Scales the coordinates of the vector into a new one
     * @param {number} value Scale coefficient
     * @returns { Vector } A vector initialized with the coordinates of the current vector scaled with the given coefficient
     */
    scale(value) {
        return new Vector({ vx: this.vx * value, vy: this.vy * value });
    }
    /**
     * Normalize the vector
     */
    normalize() {
        const distance = Math.sqrt(Math.pow(this._vx, 2) + Math.pow(this._vy, 2));
        if (distance != 0) {
            this._vx /= distance;
            this._vy /= distance;
        }
    }
}
