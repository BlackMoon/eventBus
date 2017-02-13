import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { LoginComponent } from './components/login.component';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})

export class AppComponent implements AfterViewInit {
    @ViewChild(LoginComponent) loginComponent: LoginComponent;

    ngOnInit() {
        
    }

    ngAfterViewInit() {    
        this.loginComponent.show();
        $("#pm-dashboard").mCustomScrollbar();        
    }
}