export function ModelDecorator(meta: any) {
    return function (cls) {
        // get current annotations
        let annotations = Reflect.getMetadata('annotations', cls) || [];
    }
}