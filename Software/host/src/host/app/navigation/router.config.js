"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var rxjs_1 = require("rxjs");
var views_1 = require("../views");
var decorator = require("./route.decorator");
var routesUrl = '/routes.json';
/**
 * Конфигуратор маршрутов
 */
var RouterConfig = (function () {
    function RouterConfig(http) {
        this.http = http;
    }
    Object.defineProperty(RouterConfig.prototype, "Routes", {
        get: function () {
            return this._routes;
        },
        enumerable: true,
        configurable: true
    });
    RouterConfig.prototype.load = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.http.get(routesUrl)
                .map(function (r) { return r.json(); })
                .catch(function (error) {
                console.log(routesUrl + " could not be read");
                resolve(false);
                return rxjs_1.Observable.throw(error.json().error || 'Server error');
            })
                .subscribe(function (items) {
                _this._routes = items.map(function (i) {
                    var component = decorator.routingComponents.get(i.component) || views_1.PageNotFoundView;
                    return { path: i.path, component: component };
                });
                resolve(true);
            });
        });
    };
    return RouterConfig;
}());
RouterConfig = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], RouterConfig);
exports.RouterConfig = RouterConfig;
//# sourceMappingURL=router.config.js.map