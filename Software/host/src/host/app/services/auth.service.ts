// ReSharper disable InconsistentNaming
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs';
import * as CryptoJS from 'crypto-js';
import { LoginModel } from '../models/index';
import { IDictionary } from '../utils';

const claimName = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name';

const secretUrl = '/secret';
const tokenUrl = '/token';

const passwordKey = 'pswd';
const usernameKey = 'uname';

/**
 * .net Cryptography.PaddingMode --> CryptoJS.pads mapping
 */
class Pads implements IDictionary<any>
{
    'None' = CryptoJS.pad.NoPadding;
    'PKCS7' = CryptoJS.pad.Pkcs7;
    'Zeros' = CryptoJS.pad.ZeroPadding;

    [key: string]: Object;
}

export const Storage = sessionStorage;
export const TokenKey = 'token';

/**
 * Служба аутентификации
 */
@Injectable()
export class AuthService {
    private jwtHelper: JwtHelper = new JwtHelper();
    private pads: Pads = new Pads();
    private storage: Storage;

    constructor(private http: Http) {
                
        this.storage = Storage;
    }

    isAuthenticated(): boolean {
        var token = this.storage.getItem(TokenKey);
        return true;//(token !== null) && !this.jwtHelper.isTokenExpired(token);
    }

    getCredentials(): LoginModel {
        var credentials: LoginModel = new LoginModel(),
            token = this.storage.getItem(TokenKey);
        
        if (token != null) {
            let obj = this.jwtHelper.decodeToken(token);
            credentials.username = obj[claimName];
        }

        return credentials;
    } 

    login(username?: string, password?: string): Observable<any> {

        // username & password store in base64
        let item;
        if (!username) {
            item = this.storage.getItem(usernameKey);
            item && (username = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8));
        }

        if (!password) {
            item = this.storage.getItem(passwordKey);
            item && (password = CryptoJS.enc.Base64.parse(item).toString(CryptoJS.enc.Utf8));
        }

        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });  

        var self = this;
        return this.http.post(secretUrl, `username=${username}`, options)
            .map((r: Response) => r.json())
            .mergeMap(o => {

                let cipher = CryptoJS[o.algorithm];

                if (cipher) {

                    let key = CryptoJS.enc.Base64.parse(o.key),
                        iv = CryptoJS.enc.Base64.parse(o.iv),
                        mode = CryptoJS.mode[o.mode],
                        pad = this.pads[o.padding],
                        encrypted = cipher.encrypt(password, key, { iv: iv, mode: mode, padding: pad });

                    return this.http
                        .post(tokenUrl, `username=${username}&password=${encrypted}&key=${o.key}`, options)
                        .map((r: Response) => r.json())
                        .mergeMap(o => {
                            
                            if (o.access_token) {
                                self.storage.setItem(passwordKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(password)));
                                self.storage.setItem(usernameKey, CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(username)));
                                self.storage.setItem(TokenKey, o.access_token);
                            }
                            return Observable.of(o.access_token);
                        });
                }
                else
                    throw 'Unknown algorithm';
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out        
        this.storage.removeItem(passwordKey);
        this.storage.removeItem(usernameKey);
        this.storage.removeItem(TokenKey);
    }
}