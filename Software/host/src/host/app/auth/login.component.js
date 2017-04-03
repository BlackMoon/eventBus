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
var auth_service_1 = require("./auth.service");
var models_1 = require("../models");
var utils_1 = require("../utils");
var LoginComponent = (function () {
    function LoginComponent(authService) {
        this.authService = authService;
        this.model = new models_1.AdkUserModel();
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
            height: 320,
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
        this.errorMessage = null;
        if (this.validatorRef.isValid()) {
            this.authService.login(this.model.username, this.model.password)
                .subscribe(function (next) { return _this.close(utils_1.DialogResult.OK); }, function (error) {
                var text = error.text();
                _this.errorMessage = (text) ? text :
                    error.status ? error.status + " - " + error.statusText : 'Server error';
            });
        }
    };
    LoginComponent.prototype.open = function () {
        this.dialogOptions.state = 'opened';
        this.opened.emit(null);
    };
    LoginComponent.prototype.close = function (result) {
        if (result === void 0) { result = utils_1.DialogResult.Cancel; }
        this.errorMessage = null;
        this.dialogOptions.state = 'closed';
        this.closed.emit(result);
    };
    return LoginComponent;
}());
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
        templateUrl: 'login.component.html',
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map