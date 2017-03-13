import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/index';
import { IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

declare var $: any;

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})

export class LoginComponent implements AfterViewInit {      

    @ViewChild('validator') validator: IgValidatorComponent;

    private model: any = {};        
    private dialogOptions: any;     
    private validatorOptions: any;   

    private formId: string = 'loginForm';
    private loginId: string = 'login';
    private passwordId: string = 'pswd';    

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
            height: 280,
            width: 320,
            state: "closed"
        };

        this.validatorOptions = {
            onsubmit: true,          
            required: true,
           
            fields: [{
                errorMessage: "Введите имя пользователя",
                selector: "#login"
            },
            {
                errorMessage: "Введите пароль",
                selector: "#pswd"
            }]
        }       
        
    }    

    ngAfterViewInit() {
        $("#app-login button").button();                
    }

    login() {       
                
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

    validated() {
        debugger;
    }
}