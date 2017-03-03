// ReSharper disable InconsistentNaming
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { Storage, TokenKey } from '../modules/auth.module';
import * as CryptoJS from 'crypto-js';
import { IDictionary } from '../utils';

const secretUrl = '/secret';
const tokenUrl = '/token';

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

@Injectable()
export class AuthService {
    private pads: Pads;
    private storage: Storage;

    constructor(private http: Http) {
        this.pads = new Pads();
        this.storage = Storage;
    }

    isAuthenticated(): boolean {
        var token = this.storage.getItem(TokenKey);
        return (token !== null) && !new JwtHelper().isTokenExpired(token);
    }

    login(username?: string, password?: string): Observable<any> {

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
                        .map((r: Response) =>  {
                            let obj = r.json();
                            if (obj && obj.access_token) {
                                self.storage.setItem(TokenKey, obj.access_token);
                            }
                        });
                }

                throw 'Unknown algorithm';
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out        
        this.storage.removeItem(TokenKey);
    }
}