import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Routes } from '@angular/router';

const navigationUrl = '/routes.json';

@Injectable()
export class NavigationService {

    constructor(private http: Http) {
    }

    loadRoutes(): Observable<Routes> {
        debugger;
        return this.http.get(navigationUrl)
            .map((r: Response) => r.json())
            .map((routes:Routes) => {
                debugger;
                return routes;
            });
    }    
}