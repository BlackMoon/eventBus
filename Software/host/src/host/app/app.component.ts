import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { LoginComponent } from './components/login.component';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})

export class AppComponent implements AfterViewInit {
    @ViewChild(LoginComponent) loginComponent: LoginComponent;    

    ngAfterViewInit() {    
        this.loginComponent.open();
        $("#pm-dashboard").mCustomScrollbar();        
    }
}