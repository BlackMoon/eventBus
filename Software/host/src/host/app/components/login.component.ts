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
    private validatorRef: any;   

    private formId: string = 'loginForm';
    private loginId: string = 'login';
    private passwordId: string = 'pswd';    

    constructor(
        private authService: AuthService,
        private http: AuthHttp,
        private router: Router)
    {

        let self = this;

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
            create: e => self.validatorRef = $(e.target).data("igValidator"),
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

        if (this.validatorRef.isValid()) {
            
            this.authService.login(this.model.username, this.model.password)
                .subscribe(
                next => {
                    this.router.navigate(['/']);
                    this.close();
                },
                error => {
                    debugger;
                    console.log(error);
                    //this.logService.error(error);                
                });
        }
    }

    open() {        
        this.dialogOptions.state = 'opened';
    }

    close() {
        this.dialogOptions.state = 'closed';
    }    
}