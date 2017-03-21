﻿import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { FormsModule } from '@angular/forms';
import { IgniteUIModule } from "../igniteui.module";
import { AuthService, Storage, TokenKey } from './auth.service';
import { LoginComponent } from "./login.component";

let authHttpServiceFactory = (authService: AuthService, http: Http, options: RequestOptions) => {

    return new AuthHttp(new AuthConfig({
        tokenName: TokenKey,
        tokenGetter: (() => authService.isAuthenticated ? Storage.getItem(TokenKey) : authService.login().toPromise()),
        globalHeaders: [{ 'Content-Type': 'application/json' }]
    }), http, options);
}

@NgModule({
    declarations: [LoginComponent],    
    exports: [LoginComponent],
    imports: [IgniteUIModule, FormsModule, HttpModule]    
})
export class AuthModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: AuthModule,
            providers: [
                {
                    provide: AuthHttp,
                    useFactory: authHttpServiceFactory,
                    deps: [AuthService, Http, RequestOptions]
                },
                AuthService
            ]
        }
    }
}