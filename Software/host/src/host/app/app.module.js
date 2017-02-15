"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const core_1 = require("@angular/core");
const http_1 = require("@angular/http");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const app_component_1 = require("./app.component");
const login_component_1 = require("./components/login.component");
const igniteui_angular2_1 = require("igniteui-angular2/igniteui.angular2");
const index_1 = require("./service/index");
const app_routing_1 = require("./app.routing");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule, app_routing_1.routing],
        declarations: [igniteui_angular2_1.IgDialogComponent, igniteui_angular2_1.IgTextEditorComponent, login_component_1.LoginComponent, app_component_1.AppComponent],
        bootstrap: [app_component_1.AppComponent],
        providers: [index_1.AuthenticationService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map