import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/index';

declare var $: any;

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})

export class LoginComponent implements AfterViewInit {      

    private model: any = {};        
    private dialogOptions: any;     
    private validatorOptions: any;   
    private id: string = 'validator1';

    constructor(
        private authService: AuthService,
        private http: AuthHttp,
        private router: Router) {

        this.dialogOptions = {
            headerText: "Войти в систему",
            modal: true,
            openAnimation: "slide",
            resizable: false,
            showCloseButton: false,
            showFooter: true,
            height: 260,
            width: 320,
            state: "closed"
        };


        this.validatorOptions = {
            onsubmit: true,
            successMessage: "Valid"

        }
    }    

    ngAfterViewInit() {
        $("#app-login button").button();        
    }

    login(e) {

        e.preventDefault();

        debugger;
        this.authService.login(this.model.username, this.model.password)
            .subscribe(
            next => {                
                debugger;
                
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
        this.dialogOptions.state = 'opened';
    }

    close() {
        this.dialogOptions.state = 'closed';
    }
}