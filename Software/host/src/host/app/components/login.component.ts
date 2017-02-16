import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/index';

declare var $: any;

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})

export class LoginComponent implements AfterViewInit, OnInit {      

    private model: any = {};        
    private options: any;     

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService) {

            this.options = {
                headerText: "Войти в систему",
                modal: true,
                openAnimation: "slide",
                resizable: false,
                showCloseButton: false,
                showFooter: true,
                height: 260,
                width: 320,
                state: "closed"
            }
    }    

    ngAfterViewInit() {
        $("#app-login button").button();        
    }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {        
        
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                this.router.navigate(['/']);
                this.close();
            },
            error => {
                console.log(error);
                //this.alertService.error(error);
                this.close();
            });
    }

    open() {        
        this.options.state = 'opened';
    }

    close() {
        this.options.state = 'closed';
    }
}