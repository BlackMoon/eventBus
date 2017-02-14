import { AfterViewInit, Component, ViewChild } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})

export class LoginComponent implements AfterViewInit {      

    private options: any;     

    constructor() {
        this.options = {
            headerText: "Войти в систему",
            modal: true,
            openAnimation: "slide",
            resizable: false,
            showCloseButton: false,
            showFooter: true,
            height: 300,
            width: 400,
            state: "closed"
        }
    }    

    ngAfterViewInit() {
        $("#ok").button();
        $("#cancel").button();
    }

    authenticate() {
        this.close();
    }

    open() {        
        this.options.state = 'opened';
    }

    close() {
        this.options.state = 'closed';
    }
}