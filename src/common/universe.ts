export type UniverseData = {
    width: number,
    height: number
}

/**
 * Represents the game board
 */
export class Universe
{
    //Max width of the universe
    private readonly _width: number;
    public get width(): number { return this._width; };
    
    //Max height of the universe
    private readonly _height: number;
    public get height(): number { return this._height; };
    
    /**
     * Constructor
     * @param {number} width Max width of the universe 
     * @param {number} height Max height of the universe 
     */
    constructor(width: number, height: number)
    {
        this._width = width;
        this._height = height;
    }

    /**
     * Exports data to JS object
     * @returns {UniverseData} Exported data
     */
    toData(): UniverseData
    {
        return {
            width: this.width,
            height: this.height
        };
    }
}