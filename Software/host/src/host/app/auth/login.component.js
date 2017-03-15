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
var router_1 = require("@angular/router");
var angular2_jwt_1 = require("angular2-jwt");
var index_1 = require("../services/index");
var index_2 = require("../models/index");
var igniteui_angular2_1 = require("igniteui-angular2/igniteui.angular2");
var LoginComponent = (function () {
    function LoginComponent(authService, http, router) {
        this.authService = authService;
        this.http = http;
        this.router = router;
        this.model = new index_2.LoginModel();
        this.formId = 'loginForm';
        this.loginId = 'login';
        this.passwordId = 'pswd';
        // event Handlers
        this.closed = new core_1.EventEmitter();
        this.opened = new core_1.EventEmitter();
        var self = this;
        this.dialogOptions = {
            headerText: "Войти в систему",
            modal: true,
            openAnimation: "slide",
            resizable: false,
            showCloseButton: false,
            showFooter: true,
            height: 280,
            width: 320,
            state: "closed"
        };
        this.validatorOptions = {
            onsubmit: true,
            required: true,
            create: function (e) { return self.validatorRef = $(e.target).data("igValidator"); },
            fields: [{
                    errorMessage: "Введите имя пользователя",
                    selector: "#login"
                },
                {
                    errorMessage: "Введите пароль",
                    selector: "#pswd"
                }]
        };
    }
    LoginComponent.prototype.ngAfterViewInit = function () {
        $("#app-login button").button();
    };
    LoginComponent.prototype.submit = function () {
        var _this = this;
        if (this.validatorRef.isValid()) {
            this.authService.login(this.model.username, this.model.password)
                .subscribe(function (next) {
                debugger;
                _this.router.navigate(['home']);
                _this.close();
            }, function (error) {
                debugger;
                console.log(error);
                //this.logService.error(error);                
            });
        }
    };
    LoginComponent.prototype.open = function () {
        this.dialogOptions.state = 'opened';
        this.opened.emit(null);
    };
    LoginComponent.prototype.close = function () {
        this.dialogOptions.state = 'closed';
        this.closed.emit(null);
    };
    return LoginComponent;
}());
__decorate([
    core_1.ViewChild('validator'),
    __metadata("design:type", igniteui_angular2_1.IgValidatorComponent)
], LoginComponent.prototype, "validator", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LoginComponent.prototype, "closed", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], LoginComponent.prototype, "opened", void 0);
LoginComponent = __decorate([
    core_1.Component({
        selector: 'app-login',
        styleUrls: ['login.component.css'],
        templateUrl: 'login.component.html'
    }),
    __metadata("design:paramtypes", [index_1.AuthService,
        angular2_jwt_1.AuthHttp,
        router_1.Router])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map