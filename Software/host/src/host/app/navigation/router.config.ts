import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { PageNotFoundView } from '../views';
import { Routes } from '@angular/router';
import * as decorator from './route.decorator';

const routesUrl = '/routes.json';

/**
 * Конфигурация маршрутов
 */
@Injectable()
export class RouterConfig {

    private _routes: Routes;

    get Routes(): Routes {
        return this._routes;
    }    

    constructor(private http: Http) {
    }

    load() {
        
        return new Promise((resolve, reject) => {
            this.http.get(routesUrl)
                .map(r => r.json())
                .catch((error: any): any => {
                    console.log(`${routesUrl} could not be read`);
                    resolve(false);
                    return Observable.throw(error.json().error || 'Server error');
                })
                .subscribe((items: Array<any>) => {
                    
                    this._routes = items.map(i => {
                        let component = decorator.routingComponents.get(i.component) || PageNotFoundView;
                        return <any>{ path: i.path, component: component };
                    })
                    resolve(true);
                });            
        });             
    }
}