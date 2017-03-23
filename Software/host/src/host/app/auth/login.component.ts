import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { Response } from '@angular/http';
import { AuthService } from './auth.service';
import { AdkUserModel } from '../models';
import { DialogResult } from '../utils';
import { NgStyle } from "@angular/common";

declare var $: any;

@Component({    
    selector: 'app-login',
    styleUrls: ['login.component.css'],
    templateUrl: 'login.component.html',    
})

export class LoginComponent implements AfterViewInit {     

    private model: AdkUserModel = new AdkUserModel();   

    private errorMessage: string;
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
            footerText: "<img src=\"images/ui-anim_basic_16x16.gif\">",
            modal: true,
            openAnimation: "slide",
            resizable: false,
            showCloseButton: false,
            showFooter: true,
            height: 320,
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
        this.errorMessage = null;   

        if (this.validatorRef.isValid()) {
            
            this.authService.login(this.model.username, this.model.password)
                .subscribe(
                    next => this.close(DialogResult.OK),
                    (error:Response) => {                       

                        let text = error.text();
                        this.errorMessage = (text) ? text :
                                error.status ? `${error.status} - ${error.statusText}` : 'Server error';   
                    });
        }
    }

    open() {          
        this.dialogOptions.state = 'opened';
        this.opened.emit(null);
    }

    close(result: DialogResult = DialogResult.Cancel) {  
        this.errorMessage = null;        
        this.dialogOptions.state = 'closed';
        this.closed.emit(result);
    }    
}