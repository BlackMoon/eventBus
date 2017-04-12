export enum Metatype {
    Class,
    Property
}; 

abstract class Meta {
    displayName: string;
    dataType: string;
    required: boolean;
    type: Metatype;
}

export var metas = new Map<Metatype, Meta>();

class MetaProperty extends Meta {
    type = Metatype.Property
};

export function ModelDecorator(meta: any) {
    return function (cls) {
        // get current annotations
        let annotations = Reflect.getMetadata('annotations', cls) || [];
    }
}