/**
 * Routing components storage
 * @type {Map<string, Function>}
*/
export var routingComponents = new Map<string, Function>();

/***
 * Decorator function
 * @returns {function(any): *}
 * @constructor
*/
export var RoutingComponent = (name?: string) =>
{
    return function (target: any) {
        routingComponents.set(name || target.name, target);
        return target;
    }
}