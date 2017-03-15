import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { AuthService } from './auth.service';
import { LoginModel } from '../models/index';
import { DialogResult } from '../utils';

declare var $: any;

@Component({
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html'
})

export class LoginComponent implements AfterViewInit {     

    private model: LoginModel = new LoginModel();   
         
    private dialogOptions: any;     
    private validatorOptions: any;   
    private validatorRef: any;   

    private formId: string = 'loginForm';
    private loginId: string = 'login';
    private passwordId: string = 'pswd';    

    // event Handlers
    @Output() closed: EventEmitter<DialogResult> = new EventEmitter();
    @Output() opened: EventEmitter<any> = new EventEmitter();

    constructor(private authService: AuthService)
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

    submit() {       
        
        if (this.validatorRef.isValid()) {
            
            this.authService.login(this.model.username, this.model.password)
                .subscribe(
                next => this.close(DialogResult.OK),
                error => {
                    debugger;
                    console.log(error);
                    //this.logService.error(error);                
                });
        }
    }

    open() {        
        this.dialogOptions.state = 'opened';
        this.opened.emit(null);
    }

    close(result: DialogResult = DialogResult.Cancel) {       
        this.dialogOptions.state = 'closed';
        this.closed.emit(result);
    }    
}