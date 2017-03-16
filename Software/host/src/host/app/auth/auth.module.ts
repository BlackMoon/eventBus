import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { FormsModule } from '@angular/forms';
import { AuthService, Storage, TokenKey } from './auth.service';
import { IgDialogComponent, IgTextEditorComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';
import { LoginComponent } from "./login.component";

function authHttpServiceFactory(authService: AuthService, http: Http, options: RequestOptions) {
    
    return new AuthHttp(new AuthConfig({
        tokenName: TokenKey,
        tokenGetter: (() => authService.isAuthenticated ? Storage.getItem(TokenKey) : authService.login().toPromise()),
        globalHeaders: [{ 'Content-Type': 'application/json' }]
    }), http, options);
}

@NgModule({
    declarations: [IgDialogComponent, IgTextEditorComponent, IgValidatorComponent, LoginComponent],    
    exports: [IgDialogComponent, IgTextEditorComponent, IgValidatorComponent, LoginComponent],
    imports: [FormsModule, HttpModule]    
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