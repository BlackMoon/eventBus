"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var route_decorator_1 = require("../navigation/route.decorator");
var MonitorView = (function () {
    function MonitorView() {
    }
    return MonitorView;
}());
MonitorView = __decorate([
    core_1.Component({
        template: "Monitor"
    }),
    route_decorator_1.RoutingComponent()
], MonitorView);
exports.MonitorView = MonitorView;
//# sourceMappingURL=monitor.view.js.map