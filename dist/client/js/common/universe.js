/**
 * Represents the game board
 */
export class Universe {
    //Max width of the universe
    _width;
    get width() { return this._width; }
    ;
    //Max height of the universe
    _height;
    get height() { return this._height; }
    ;
    /**
     * Constructor
     * @param {number} width Max width of the universe
     * @param {number} height Max height of the universe
     */
    constructor(width, height) {
        this._width = width;
        this._height = height;
    }
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
