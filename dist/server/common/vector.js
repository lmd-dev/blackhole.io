"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
/**
 * Represents a vector
 */
class Vector {
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
    get vx() { return this._vx; }
    ;
    set vx(value) { this._vx = value; }
    get vy() { return this._vy; }
    ;
    set vy(value) { this._vy = value; }
    /**
     * Imports data from JS Object
     * @param {VectorData} data Data to import
     */
    fromData(data) {
        var _a, _b;
        this._vx = (_a = data.vx) !== null && _a !== void 0 ? _a : this._vx;
        this._vy = (_b = data.vy) !== null && _b !== void 0 ? _b : this._vy;
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
exports.Vector = Vector;
