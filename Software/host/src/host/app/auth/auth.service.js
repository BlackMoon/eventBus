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
// ReSharper disable InconsistentNaming
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var rxjs_1 = require("rxjs");
var CryptoJS = require("crypto-js");
var index_1 = require("../models/index");
var claimName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';
var secretUrl = '/secret';
var tokenUrl = '/token';
var passwordKey = 'pswd';
var usernameKey = 'uname';
/**
 * .net Cryptography.PaddingMode --> CryptoJS.pads mapping
 */
var Pads = (function () {
    function Pads() {
        this['None'] = CryptoJS.pad.NoPadding;
        this['PKCS7'] = CryptoJS.pad.Pkcs7;
        this['Zeros'] = CryptoJS.pad.ZeroPadding;
    }
    return Pads;
}());
exports.Storage = localStorage; //sessionStorage;
exports.TokenKey = 'token';
/**
 * Служба аутентификации
 */
var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.jwtHelper = new angular2_jwt_1.JwtHelper();
        this.pads = new Pads();
        this.storage = exports.Storage;
    }
    AuthService.prototype.isAuthenticated = function () {
        var token = this.storage.getItem(exports.TokenKey);
        return (token !== null) && !this.jwtHelper.isTokenExpired(token);
    };
    AuthService.prototype.getCredentials = function () {
        var credentials = new index_1.LoginModel(), token = this.storage.getItem(exports.TokenKey);
        if (token != null) {
            var obj = this.jwtHelper.decodeToken(token);
            credentials.username = obj[claimName];
        }
        return credentials;
    };
    AuthService.prototype.login = function (username, password) {
        var _this = this;
        // username & password store in base64
        var item;
        if (!username) {
            item = this.storage.getItem(usernameKey);
            item && (username = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8));
        }
        if (!password) {
            item = this.storage.getItem(passwordKey);
            item && (password = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8));
        }
        var headers = new http_1.Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        var options = new http_1.RequestOptions({ headers: headers });
        var self = this;
        return this.http.post(secretUrl, "username=" + username, options)
            .map(function (r) { return r.json(); })
            .mergeMap(function (o) {
            var cipher = CryptoJS[o.algorithm];
            if (cipher) {
                var key = CryptoJS.enc.Base64.parse(o.key), iv = CryptoJS.enc.Base64.parse(o.iv), mode = CryptoJS.mode[o.mode], pad = _this.pads[o.padding], encrypted = cipher.encrypt(password, key, { iv: iv, mode: mode, padding: pad });
                return _this.http
                    .post(tokenUrl, "username=" + username + "&password=" + encrypted + "&key=" + o.key, options)
                    .map(function (r) { return r.json(); })
                    .mergeMap(function (o) {
                    if (o.access_token) {
                        self.storage.setItem(passwordKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password)));
                        self.storage.setItem(usernameKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(username)));
                        self.storage.setItem(exports.TokenKey, o.access_token);
                    }
                    return rxjs_1.Observable.of(o.access_token);
                });
            }
            else
                return rxjs_1.Observable.throw('Unknown algorithm');
        });
    };
    AuthService.prototype.logout = function () {
        // clear token remove user from local storage to log user out        
        this.storage.removeItem(passwordKey);
        this.storage.removeItem(usernameKey);
        this.storage.removeItem(exports.TokenKey);
    };
    return AuthService;
}());
AuthService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map