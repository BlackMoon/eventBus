import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/index';

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
        private authService: AuthService,
        private http: AuthHttp,
        private router: Router) {

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
    }

    login() {        
        
        this.authService.login(this.model.username, this.model.password)
            .subscribe(
            next => {                
                debugger;
                let b = this.authService.isAuthenticated();
                this.http.get("/api/values").subscribe(
                    next => {
                        debugger;
                    },
                    error => {
                        debugger;
                    });


                //this.router.navigate(['/']);
                //this.close();
            },
            error => {
                debugger;
                console.log(error);
                //this.alertService.error(error);                
            });
    }

    open() {        
        this.options.state = 'opened';
    }

    close() {
        this.options.state = 'closed';
    }
}