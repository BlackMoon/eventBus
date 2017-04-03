"use strict";
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var core_1 = require("@angular/core");
var app_module_1 = require("./app.module");
if (process.env.ENV === 'production') {
    core_1.enableProdMode();
}
var boot = document.addEventListener('DOMContentLoaded', function () {
    platform_browser_dynamic_1.platformBrowserDynamic()
        .bootstrapModule(app_module_1.AppModule);
});
module.exports = boot;
//# sourceMappingURL=index.js.map