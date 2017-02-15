import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

const authKey = 'currentUser';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) { }

    login(username: string, password: string) {

        let body = `username=${username}&password=${password}`;  
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
        let options = new RequestOptions({ headers: headers });        

        return this.http
            .post('api/token', body, options)                
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let user = response.json();
                debugger;
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem(authKey, JSON.stringify(user));
                }
            });
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem(authKey);
    }
}