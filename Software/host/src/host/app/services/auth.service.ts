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

    byteArrayToWordArray(ba: number[]) {
        var wa = [],
            i;
        for (i = 0; i < ba.length; i++) {
            wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
        }

        return CryptoJS.lib.WordArray.create(wa, ba.length);    
    }

    wordToByteArray(word, length) : any[] {
        var ba = [],
            i,
            xFF = 0xFF;
        if (length > 0)
            ba.push(word >>> 24);
        if (length > 1)
            ba.push((word >>> 16) & xFF);
        if (length > 2)
            ba.push((word >>> 8) & xFF);
        if (length > 3)
            ba.push(word & xFF);

        return ba;
    }

    wordArrayToByteArray(wordArray, length) {
        if (wordArray.hasOwnProperty("sigBytes") && wordArray.hasOwnProperty("words")) {
            length = wordArray.sigBytes;
            wordArray = wordArray.words;
        }

        var result = [],
            bytes,
            i = 0;
        while (length > 0) {
            bytes = this.wordToByteArray(wordArray[i], Math.min(4, length));
            length -= bytes.length;
            result.push(bytes);
            i++;
        }
        return [].concat.call([], result);
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
                debugger;

                let cipher = CryptoJS[o.algorithm];

                if (cipher) {

                    let key = CryptoJS.enc.Base64.parse(o.key),
                        iv = CryptoJS.enc.Base64.parse(o.iv),
                        mode = CryptoJS.mode[o.mode],
                        pad = CryptoJS.pad.Pkcs7;

                    switch (o.padding)
                    {
                        case 'None':
                            pad = CryptoJS.pad.NoPadding;
                            break;

                        case 'PKCS7':
                            pad = CryptoJS.pad.Pkcs7;
                            break;

                        case 'Zeros':
                            pad = CryptoJS.pad.ZeroPadding;
                            break;
                    }

                    let encrypted = cipher.encrypt(password, key, { iv: iv, mode: mode, padding: pad });

                    return this.http
                        .post(tokenUrl, `username=${username}&password=${encrypted}&key=${o.key}`, options)
                        .map((r: Response) =>  {
                            var obj = r.json();
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