import { Observer } from "./observer.js";

/**
 * Represents a Notifier on the Notifier/Observer pattern
 */
export class Notifier
{
    //List of observers to the notifier
    private readonly observers: Observer[];

    /**
     * Constructor
     */
    constructor()
    {
        this.observers = [];
    }

    /**
     * Adds an observer to the notifier
     * @param {Observer} observer Observer to add 
     */
    addObserver(observer: Observer)
    {
        this.observers.push(observer);
    }

    /**
     * Notifies all the observer of the notifier
     */
    notify()
    {
        this.observers.forEach((observer) => {
            observer.notify();
        })
    }
}