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
var router_1 = require("@angular/router");
var auth_service_1 = require("./auth/auth.service");
var login_component_1 = require("./auth/login.component");
var router_config_1 = require("./navigation/router.config");
var index_1 = require("./models/index");
var app_menu_1 = require("./app.menu");
var utils_1 = require("./utils");
var startViewKey = 'returnUrl';
var AppComponent = (function () {
    function AppComponent(authService, router, routerConfig) {
        this.authService = authService;
        this.router = router;
        this.routerConfig = routerConfig;
        this.menu = [];
        this.startView = new http_1.URLSearchParams(window.location.search).get(startViewKey);
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.$navigation = $("#pm-navigation").mCustomScrollbar({
            theme: "dark",
            axis: 'y'
        });
        this.$settings = $("#pm-team-navigation");
        if (this.authService.isAuthenticated) {
            if (this.startView != undefined) {
                if (this.menu.length > 0) {
                    var mi = this.menu.find(function (item) { return item.route.toLowerCase() === _this.startView; });
                    this.menuItemClick(mi);
                }
                else
                    this.router.navigate([this.startView]);
            }
            else {
                (this.menu.length > 0) && this.menuItemClick(this.menu[0]);
            }
        }
        else
            this.login();
    };
    AppComponent.prototype.ngOnInit = function () {
        // Маршруты        
        var config = this.routerConfig.Routes.concat(this.router.config);
        this.router.resetConfig(config);
        // Данные
        (this.authService.isAuthenticated) && this.retrieveUser();
    };
    AppComponent.prototype.menuItemClick = function (item) {
        this.$navigation.switchClass('expanded', 'collapsed'); // collapse navigation        
        if (item != null) {
            this.router.navigate([item.route]);
            this.menu.forEach(function (mi) { return mi.active = false; });
            item.active = true;
        }
    };
    AppComponent.prototype.login = function () {
        this.loginComponent.open();
        this.$navigation.switchClass('expanded', 'collapsed'); // collapse navigation  
    };
    AppComponent.prototype.logout = function () {
        this.authService.logout();
    };
    AppComponent.prototype.loginComponent_Closed = function (result) {
        if (result === utils_1.DialogResult.OK) {
            this.retrieveUser();
            (this.menu.length > 0) && this.menuItemClick(this.menu[0]);
        }
    };
    /**
     * Извлечь сохраненные данные
     */
    AppComponent.prototype.retrieveUser = function () {
        var _this = this;
        this.loggedUser = this.authService.LoggedUser;
        // Фильтр меню для текущего пользователя
        var predicatesFor = [], predicatesNot = [];
        if (this.loggedUser.isadmin) {
            predicatesFor.push(function (v) { return v.for.findIndex(function (i) { return i.toLowerCase() === index_1.AdministratorsGroup.toLowerCase(); }) != -1; });
            predicatesNot.push(function (v) { return v.not.findIndex(function (i) { return i.toLowerCase() === index_1.AdministratorsGroup.toLowerCase(); }) === -1; });
        }
        else {
            predicatesFor.push(function (v) { return v.for.findIndex(function (i) { return i.toLowerCase() === index_1.UsersGroup.toLowerCase(); }) != -1; });
            predicatesNot.push(function (v) { return v.not.findIndex(function (i) { return i.toLowerCase() === index_1.UsersGroup.toLowerCase(); }) === -1; });
        }
        predicatesFor.push(function (v) { return v.for.findIndex(function (i) { return i.toLowerCase() === _this.loggedUser.username.toLowerCase(); }) != -1; });
        predicatesNot.push(function (v) { return v.not.findIndex(function (i) { return i.toLowerCase() === _this.loggedUser.username.toLowerCase(); }) === -1; });
        this.menu = app_menu_1.appMenu.filter(function (mi) {
            var found = true;
            // array [for]
            if (mi.for != undefined) {
                for (var _i = 0, predicatesFor_1 = predicatesFor; _i < predicatesFor_1.length; _i++) {
                    var pre = predicatesFor_1[_i];
                    if (found = pre.call(_this, mi))
                        break;
                }
            }
            // still not found --> array [not]
            if (!found && mi.not != undefined) {
                for (var _a = 0, predicatesNot_1 = predicatesNot; _a < predicatesNot_1.length; _a++) {
                    var pre = predicatesNot_1[_a];
                    if (found = pre.call(_this, mi))
                        break;
                }
            }
            return found;
        });
    };
    AppComponent.prototype.toggleNavBar = function (e) {
        e.preventDefault();
        this.$navigation.toggleClass('expanded');
    };
    AppComponent.prototype.toggleTeamBar = function (e) {
        e.preventDefault();
        this.$settings[$(e.currentTarget).hasClass('slide-team-directory') ? 'addClass' : 'removeCalss']('directory-view');
        // collapsed --> expand
        if (this.$settings.hasClass('collapsed')) {
            // Handles Open animation for Team Resource Selection Slide
            if (this.$settings.hasClass('directory-view')) {
                $('#project-panel #headline .action.slide-team-directory')
                    .animate({ "right": "351px", "easing": "easeInQuad" }, 50)
                    .css({ 'position': 'fixed' });
                this.$settings
                    .animate({ "right": "0px", "easing": "easeInQuad" }, 50)
                    .switchClass('collapsed', 'expanded');
            }
            else {
                this.$settings
                    .animate({ "right": '0px', easing: "easeInQuad" }, 50)
                    .switchClass('collapsed', 'expanded');
            }
        }
        else {
            if (this.$settings.css('right') === '0px') {
                var tdWidth = this.$settings.outerWidth();
                if (this.$settings.hasClass('directory-view')) {
                    $('#project-panel #headline .action.slide-team-directory')
                        .animate({ "right": "0px", "easing": "easeInQuad" }, 0)
                        .css({ 'position': 'absolute' });
                    this.$settings.switchClass('expanded', 'collapsed')
                        .animate({ "right": '-' + (tdWidth + 350) + 'px', "easing": "easeInQuad" }, 0);
                }
                else {
                    this.$settings
                        .switchClass('expanded', 'collapsed')
                        .animate({ "right": '-' + (tdWidth + 350) + 'px', easing: "easeOutQuad" }, 0);
                }
            }
        }
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild(login_component_1.LoginComponent),
    __metadata("design:type", login_component_1.LoginComponent)
], AppComponent.prototype, "loginComponent", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: 'eventBus-app',
        styleUrls: ['app.component.css'],
        templateUrl: 'app.component.html'
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.Router,
        router_config_1.RouterConfig])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map