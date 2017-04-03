"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var igniteui_angular2_1 = require("igniteui-angular2/igniteui.angular2");
/**
 * AppUI модуль
 */
var AppUIModule = (function () {
    function AppUIModule() {
    }
    return AppUIModule;
}());
AppUIModule = __decorate([
    core_1.NgModule({
        declarations: [igniteui_angular2_1.IgDialogComponent, igniteui_angular2_1.IgTextEditorComponent, igniteui_angular2_1.IgTreeGridComponent, igniteui_angular2_1.IgValidatorComponent],
        exports: [igniteui_angular2_1.IgDialogComponent, igniteui_angular2_1.IgTextEditorComponent, igniteui_angular2_1.IgTreeGridComponent, igniteui_angular2_1.IgValidatorComponent, common_1.CommonModule],
        imports: [common_1.CommonModule]
    })
], AppUIModule);
exports.AppUIModule = AppUIModule;
//# sourceMappingURL=app-ui.module.js.map