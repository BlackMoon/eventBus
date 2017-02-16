import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

const authTimeKey = 'authTime';
const tokenKey = 'token';
const tokenExpiresKey = 'expires';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) { }

    isAuthenticated(): boolean {

        return (sessionStorage.getItem(tokenKey) !== null);
    }

    login(username: string, password: string): Observable<void> {

        let body = `username=${username}&password=${password}`;  
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });        

        return new Observable<void>();
        /*
        return this.http
            .post('api/token', body, options)                
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let obj = response.json();
               
                if (obj && obj.access_token) {
                    // store jwt token in session storage to keep user logged in between page refreshes
                    sessionStorage.setItem(authTimeKey, new Date().toString());
                    sessionStorage.setItem(tokenKey, obj.access_token);
                    sessionStorage.setItem(tokenExpiresKey, obj.expires_in);                    
                }
            });*/
    }

    logout() {
        // remove token from local storage to log user out
        sessionStorage.removeItem(authTimeKey);
        sessionStorage.removeItem(tokenKey);
        sessionStorage.removeItem(tokenExpiresKey);
    }
}