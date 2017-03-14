import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AuthService, Storage, TokenKey } from '../services/index';

export { LoginComponent } from "../components/login.component";

function authHttpServiceFactory(authService: AuthService, http: Http, options: RequestOptions) {
    
    return new AuthHttp(new AuthConfig({
        tokenName: TokenKey,
        tokenGetter: (() => authService.isAuthenticated() ? Storage.getItem(TokenKey) : authService.login().toPromise()),
        globalHeaders: [{ 'Content-Type': 'application/json' }]
    }), http, options);
}

@NgModule({
    
    providers: [
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [AuthService, Http, RequestOptions]
        }
    ]
})
export class AuthModule { }