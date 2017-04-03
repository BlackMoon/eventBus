"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Metatype;
(function (Metatype) {
    Metatype[Metatype["Class"] = 0] = "Class";
    Metatype[Metatype["Property"] = 1] = "Property";
})(Metatype = exports.Metatype || (exports.Metatype = {}));
;
var Meta = (function () {
    function Meta() {
    }
    return Meta;
}());
exports.metas = new Map();
var MetaProperty = (function (_super) {
    __extends(MetaProperty, _super);
    function MetaProperty() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = Metatype.Property;
        return _this;
    }
    return MetaProperty;
}(Meta));
;
function ModelDecorator(meta) {
    return function (cls) {
        // get current annotations
        var annotations = Reflect.getMetadata('annotations', cls) || [];
    };
}
exports.ModelDecorator = ModelDecorator;
//# sourceMappingURL=model.decorator.js.map