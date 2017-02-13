import { Component, AfterViewInit } from '@angular/core';

declare var $: any;

@Component({
    selector: 'app-login',
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
        $("input[type=submit]").button();
        $("input[type=reset]").button();
    }

    show() {        
        this.options.state = 'opened';
    }

    hide() {
        this.options.state = 'closed';
    }
}