import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Storage, TokenKey } from '../modules/auth.module';
import * as CryptoJS from 'crypto-js';

const secretUrl = '/secret';
const tokenUrl = '/token';

@Injectable()
export class AuthService {
    private storage: Storage;

    constructor(private http: Http) {
        this.storage = Storage;   
    }

    isAuthenticated = function () {
        var token = this.storage.getItem(TokenKey);
        return (token !== null) && !new JwtHelper().isTokenExpired(token);
    };

    login(username?: string, password?: string): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });        

        return this.http.post(secretUrl, `username=${username}`, options)
            .map((r: Response) => r.json())
            .mergeMap(o => {
                debugger;
                var encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Base64.parse(o.key), {
                    iv: CryptoJS.enc.Hex.parse('fedcba9876543210'),
                    padding: CryptoJS.pad.NoPadding,
                    mode: CryptoJS.mode.CBC
                });

                return this.http
                    .post(tokenUrl, "username=" + username + "&password=" + encrypted.ciphertext + "&secret=" + o.key, options)
                    .map(function (r) {
                        var obj = r.json();
                        if (obj && obj.access_token) {
                            this.storage.setItem(TokenKey, obj.access_token);
                        }
                    });
            })
    }

    logout(): void {
        // clear token remove user from local storage to log user out        
        storage.removeItem(TokenKey);
    }
}