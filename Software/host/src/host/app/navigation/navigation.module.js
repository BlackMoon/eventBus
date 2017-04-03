"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_config_1 = require("./router.config");
var router_1 = require("@angular/router");
var selective_preloading_strategy_1 = require("./selective-preloading-strategy");
var logger_component_1 = require("../logger/logger.component");
var views = require("../views");
var appRoutes = [
    { path: 'logger', component: logger_component_1.LoggerComponent },
    { path: '**', component: views.PageNotFoundView }
];
var NavigationModule = NavigationModule_1 = (function () {
    function NavigationModule() {
    }
    NavigationModule.forRoot = function () {
        return {
            ngModule: NavigationModule_1,
            providers: [
                router_config_1.RouterConfig,
                { provide: core_1.APP_INITIALIZER, useFactory: function (config) { return function () { return config.load(); }; }, deps: [router_config_1.RouterConfig], multi: true },
                selective_preloading_strategy_1.SelectivePreloadingStrategy
            ]
        };
    };
    return NavigationModule;
}());
NavigationModule = NavigationModule_1 = __decorate([
    core_1.NgModule({
        entryComponents: [views.MonitorView, views.UsersTreeView],
        exports: [router_1.RouterModule],
        imports: [
            router_1.RouterModule.forRoot(appRoutes, { preloadingStrategy: selective_preloading_strategy_1.SelectivePreloadingStrategy })
        ]
    })
], NavigationModule);
exports.NavigationModule = NavigationModule;
var NavigationModule_1;
//# sourceMappingURL=navigation.module.js.map