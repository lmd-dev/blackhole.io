import { Vector } from "./vector";

export type CoordinateData = {
    x: number;
    y: number;
}

/**
 * Represents a coordinate
 */
export class Coordinate
{
    //X coordinate
    private _x: number;
    public get x(): number { return this._x; };
    public set x(value: number) { this._x = value; }
    
    //Y coordinate
    private _y: number;
    public get y(): number { return this._y; };
    public set y(value: number) { this._y = value; }
    
    /**
     * Constructor
     * @param {CoordinateData} data Initialization data 
     */
    constructor(data: CoordinateData | null = null)
    {
        this._x = 0;
        this._y = 0;

        if(data)
            this.fromData(data);
    }

    /**
     * Imports data from JS Object
     * @param {CoordinateData} data Data to import 
     */
    fromData(data: CoordinateData)
    {
        this._x = data.x ?? this._x;
        this._y = data.y ?? this._y;
    }

    /**
     * Exports data to JS object
     * @returns {CoordinateData} Exported data
     */
    toData(): CoordinateData
    {
        return {
            x: this.x,
            y: this.y
        }
    }

    /**
     * Moves the coordinate from the given vector
     * @param {Vector} vector Translation vector
     */
    move(vector: Vector)
    {
        this._x += vector.vx;
        this._y += vector.vy;
    }

    rotate(origin: Coordinate, angle: number)
    {
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
    distance(coordinate: Coordinate)
    {
        return Math.sqrt(Math.pow(this.x - coordinate.x, 2) + Math.pow(this.y - coordinate.y, 2));
    }
}