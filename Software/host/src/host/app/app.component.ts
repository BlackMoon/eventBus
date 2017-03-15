import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login.component';
import { LoginModel } from './models/index';
import { DialogResult } from './utils';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit, OnInit {    
    @ViewChild(LoginComponent) loginComponent: LoginComponent;

    private credentials: LoginModel;

    constructor(private authService: AuthService,
        private router: Router)
    {        
    }

    ngAfterViewInit() {    
        
        !this.authService.isAuthenticated() && this.login();
        $("#pm-dashboard").mCustomScrollbar();        
    }    

    ngOnInit() {
        // Загрузить данные
        this.credentials = this.authService.getCredentials();     
    }

    login() {       
        this.loginComponent.open();        
    }

    logout() {
        this.authService.logout();
    }    

    loginComponent_Closed(result: DialogResult) {

        if (result == DialogResult.OK)
        {
            // Загрузить данные
            this.credentials = this.authService.getCredentials();        
            this.router.navigate(['home']);
        }
    }

    toggleNavBar(e) {
        
        e.preventDefault();
        $('#pm-navigation').toggleClass('expanded');
    }
}