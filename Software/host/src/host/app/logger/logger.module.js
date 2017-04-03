"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var app_ui_module_1 = require("../app-ui.module");
var logger_component_1 = require("./logger.component");
var logger_service_1 = require("./logger.service");
var LoggerModule = (function () {
    function LoggerModule() {
    }
    return LoggerModule;
}());
LoggerModule = __decorate([
    core_1.NgModule({
        declarations: [logger_component_1.LoggerComponent],
        exports: [logger_component_1.LoggerComponent],
        imports: [app_ui_module_1.AppUIModule],
        providers: [logger_service_1.LoggerService]
    })
], LoggerModule);
exports.LoggerModule = LoggerModule;
//# sourceMappingURL=logger.module.js.map