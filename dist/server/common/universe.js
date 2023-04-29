"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Universe = void 0;
/**
 * Represents the game board
 */
class Universe {
    /**
     * Constructor
     * @param {number} width Max width of the universe
     * @param {number} height Max height of the universe
     */
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }
    get width() { return this._width; }
    ;
    get height() { return this._height; }
    ;
    /**
     * Exports data to JS object
     * @returns {UniverseData} Exported data
     */
    toData() {
        return {
            width: this.width,
            height: this.height
        };
    }
}
exports.Universe = Universe;
