/**
 * Components storage
 * @type {Map<string, Function>}
*/
export var namedComponents = new Map<string, Function>();
/***
 * Named component (can be resolved by string name)
 * @returns {function(any): *}
 * @constructor
*/
export var NamedComponent = (name?: string) => {
    return (target: any) => {
        let key = name || target.name;
        namedComponents.set(key.toLowerCase(), target);
        return target;
    }
}