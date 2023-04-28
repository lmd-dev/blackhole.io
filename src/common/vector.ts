export type VectorData = {
    vx: number;
    vy: number;
}

/**
 * Represents a vector
 */
export class Vector
{
    //X coordinate of the vector
    private _vx: number;
    public get vx(): number { return this._vx; };
    public set vx(value: number) { this._vx = value; }
    
    //Y coordinate of the vector
    private _vy: number;
    public get vy(): number { return this._vy; };
    public set vy(value: number) { this._vy = value; }
    
    /**
     * Constructor
     * @param {VectorData} data Initialization Data
     */
    constructor(data: VectorData | null = null)
    {
        this._vx = 0;
        this._vy = 0;

        if(data)
            this.fromData(data);
    }

    /**
     * Imports data from JS Object
     * @param {VectorData} data Data to import 
     */
    fromData(data: VectorData)
    {
        this._vx = data.vx ?? this._vx;
        this._vy = data.vy ?? this._vy;
    }

    /**
     * Exports data to JS object
     * @returns {VectorData} Exported data
     */
    toData(): VectorData
    {
        return {
            vx: this.vx,
            vy: this.vy
        }
    }

    /**
     * Scales the coordinates of the vector into a new one
     * @param {number} value Scale coefficient
     * @returns { Vector } A vector initialized with the coordinates of the current vector scaled with the given coefficient
     */
    scale(value: number): Vector
    {
        return new Vector({ vx: this.vx * value, vy: this.vy * value});
    }

    /**
     * Normalize the vector
     */
    normalize()
    {
        const distance = Math.sqrt(Math.pow(this._vx, 2) + Math.pow(this._vy, 2))

        if(distance != 0)
        {
            this._vx /= distance;
            this._vy /= distance;
        }
    }
}