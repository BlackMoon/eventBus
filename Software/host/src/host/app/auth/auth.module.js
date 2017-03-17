"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var forms_1 = require("@angular/forms");
var auth_service_1 = require("./auth.service");
var igniteui_angular2_1 = require("igniteui-angular2/igniteui.angular2");
var login_component_1 = require("./login.component");
var authHttpServiceFactory = function (authService, http, options) {
    return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
        tokenName: auth_service_1.TokenKey,
        tokenGetter: (function () { return authService.isAuthenticated ? auth_service_1.Storage.getItem(auth_service_1.TokenKey) : authService.login().toPromise(); }),
        globalHeaders: [{ 'Content-Type': 'application/json' }]
    }), http, options);
};
var AuthModule = AuthModule_1 = (function () {
    function AuthModule() {
    }
    AuthModule.forRoot = function () {
        return {
            ngModule: AuthModule_1,
            providers: [
                {
                    provide: angular2_jwt_1.AuthHttp,
                    useFactory: authHttpServiceFactory,
                    deps: [auth_service_1.AuthService, http_1.Http, http_1.RequestOptions]
                },
                auth_service_1.AuthService
            ]
        };
    };
    return AuthModule;
}());
AuthModule = AuthModule_1 = __decorate([
    core_1.NgModule({
        declarations: [igniteui_angular2_1.IgDialogComponent, igniteui_angular2_1.IgTextEditorComponent, igniteui_angular2_1.IgValidatorComponent, login_component_1.LoginComponent],
        exports: [igniteui_angular2_1.IgDialogComponent, igniteui_angular2_1.IgTextEditorComponent, igniteui_angular2_1.IgValidatorComponent, login_component_1.LoginComponent],
        imports: [forms_1.FormsModule, http_1.HttpModule]
    })
], AuthModule);
exports.AuthModule = AuthModule;
var AuthModule_1;
//# sourceMappingURL=auth.module.js.map