import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoginComponent } from "./modules/auth.module";
import { AuthService } from './services/index';
import { LoginModel } from './models/index';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})

export class AppComponent implements AfterViewInit {    
    @ViewChild(LoginComponent) loginComponent: LoginComponent;

    private credentials: LoginModel;

    constructor(private authService: AuthService) {
        this.load();
    }

    ngAfterViewInit() {    
        
        !this.authService.isAuthenticated() && this.login();
        $("#pm-dashboard").mCustomScrollbar();        
    }    

    login() {       
        this.loginComponent.open();
    }

    logout() {
        this.authService.logout();
    }

    /**
     * Загрузить данные
     */
    load() {        
        this.credentials = this.authService.getCredentials();        
    }

    toggleNavBar(e) {
        
        e.preventDefault();
        $('#pm-navigation').toggleClass('expanded');
    }
}