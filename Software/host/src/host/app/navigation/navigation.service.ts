import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Routes } from '@angular/router';
import { PageNotFoundView } from '../views';
import { namedComponents } from '../ui/named.decorator';

const navigationUrl = '/routes.json';

@Injectable()
export class NavigationService {

    constructor(private http: Http) {
    }

    loadRoutes(): Observable<Routes> {
        
        return this.http.get(navigationUrl)
            .map((r: Response) => r.json())
            .map((items: Array<any>) => {
                
                return items.map(i => {
                    let component = namedComponents.get(i.component) || PageNotFoundView;
                    return <any>{ path: i.path, component: component };
                });
            });
    }    
}