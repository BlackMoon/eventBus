//import "reflect-metadata";

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
    };
};

/**
 * DisplayAttribute
 */
const displayMetadataKey = "Display";

export class DisplayAttribute {
    static getMetadata = (target: Object, targetKey?: string | symbol): any => Reflect.getMetadata(displayMetadataKey, target, targetKey);
}

export const Display = (name?: string) => {
    return Reflect.metadata(displayMetadataKey, name);
};
