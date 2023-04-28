import { Coordinate, CoordinateData } from "./coordinate.js";
import { Vector, VectorData } from "./vector.js";

export type BlackHoleData = {
    name: string;
    color: string;
    coordinate: CoordinateData;
    direction: VectorData;
    speed: number;
    radius: number;
    attractionVectors: VectorData[];
};

/**
 * Represents a blackhole
 */
export class BlackHole
{
    //Default radius of a Blackhole
    public static readonly DEFAULT_RADIUS: number = 15;

    //Default speed of a Blackhole
    public static readonly DEFAULT_SPEED: number = 0.01;

    //Name if the player controlling the blackhole
    private _name: string;
    public get name(): string { return this._name; };

    //Color of the blackhole
    private _color: string;
    public get color(): string { return this._color; };
    
    //Coordinate of the blackhole
    private readonly _coordinate: Coordinate;
    public get coordinate(): Coordinate { return this._coordinate; };
    
    //Direction of the blackhole
    private _direction: Vector;
    public get direction(): Vector { return this._direction; };
  
    //Speed of the blackhole
    private _speed: number;
    public get speed(): number { return this._speed; };
    
    //Attractions undergone by the blackhole
    private readonly _attractionVectors: Vector[];
    public get attractionVectors(): Vector[] { return this._attractionVectors; };
    
    //Radius of the blackhole
    private _radius: number;
    public get radius(): number { return this._radius; };
    
    /**
     * Constructor
     * @param {BlackHoleData} data Initialization data 
     */
    constructor(data: BlackHoleData)
    {
        this._name = data.name;
        this._color = data.color;
        this._coordinate = new Coordinate(data.coordinate);
        this._direction = new Vector(data.direction);
        this._direction.normalize();
        this._speed = data.speed;
        
        this._attractionVectors = [];
        this._radius = data.radius;
    }

    /**
     * Imports data from JS Object
     * @param {BlackHoleData} data Data to import 
     */
    fromData(data: BlackHoleData)
    {
        this._name = data.name ?? this._name;
        this._color = data.color ?? this._color;

        if(data.coordinate)
            this._coordinate.fromData(data.coordinate);
        
        if(data.direction)
        this._direction.fromData(data.direction);

        this._speed = data.speed ?? this._speed;
        this._radius = data.radius ?? this._radius;

        this._attractionVectors.length = 0;
        this._attractionVectors.push(...data.attractionVectors?.map((vector) => { return new Vector(vector); }) ?? []);
    }

    /**
     * Exports data to JS object
     * @returns {BlackHoleData} Exported data
     */
    toData(): BlackHoleData
    {
        return {
            name: this.name,
            color: this.color,
            coordinate: this.coordinate.toData(),
            direction: this.direction.toData(),
            speed: this.speed,
            radius: this.radius,
            attractionVectors: this._attractionVectors.map((vector) => { return vector.toData() })
        }
    }

    /**
     * Updates the position of the blackhole
     * @param {number} elapsedTime Elapsed time from the last update 
     */
    update(elapsedTime : number)
    {
        this.coordinate.move(this._direction.scale(elapsedTime * this.speed));
    }

    /**
     * Directs the blachole to the given coordinate
     * @param {Coordinate} coordinate Coordinate to direct the blackhole to 
     */
    moveTo(coordinate: Coordinate)
    {
        this.direction.vx = coordinate.x - this._coordinate.x;
        this.direction.vy = coordinate.y - this._coordinate.y;

        this.direction.normalize();
    }

    /**
     * Absorbs another blachole
     * @param {BlackHole} blackhole Blackhole to absorb 
     */
    absorb(blackhole: BlackHole)
    {
        this._radius = Math.sqrt(Math.pow(this.radius, 2) + Math.pow(blackhole.radius, 2));
    }
}