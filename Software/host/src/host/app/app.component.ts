﻿import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoginComponent } from './components/login.component';
import { AuthService } from './services/index';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})

export class AppComponent implements AfterViewInit {
    @ViewChild(LoginComponent) loginComponent: LoginComponent;

    constructor(private authService: AuthService) { }

    ngAfterViewInit() {    
        !this.authService.isAuthenticated() && this.loginComponent.open();
        $("#pm-dashboard").mCustomScrollbar();        
    }
}