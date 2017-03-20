import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Routes } from '@angular/router';
import * as views from '../views';

const navigationUrl = '/routes.json';

@Injectable()
export class NavigationService {

    constructor(private http: Http) {
    }

    loadRoutes(): Observable<Routes> {
        debugger;
        return this.http.get(navigationUrl)
            .map((r: Response) => r.json())
            .map((items: Array<any>) => {

                debugger;

                return items.map(i => <any>{ path: i.path, component: i.component, name: i.component })

                //return [{ path: 'path' }];                
            });
    }    
}