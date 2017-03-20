import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login.component';
import { RouterConfig } from './navigation/router.config';
import { AdkUserModel, MenuItem, AdministratorsGroup, UsersGroup } from './models/index';
import { appMenu } from './app.menu';
import { DialogResult } from './utils';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit, OnInit {    
    @ViewChild(LoginComponent) loginComponent: LoginComponent;

    private menu: Array<MenuItem> = [];
    private loggedUser: AdkUserModel;    

    constructor(
        private authService: AuthService,        
        private router: Router,
        private routerConfig: RouterConfig)
    {        
    }

    ngAfterViewInit() {    
        
        !this.authService.isAuthenticated && this.login();
        $("#pm-dashboard").mCustomScrollbar();          
    }    

    ngOnInit() {

        // Маршруты        
        let config = this.routerConfig.Routes.concat(this.router.config);
        this.router.resetConfig(config);        
        
        // Данные
        (this.authService.isAuthenticated) && this.retrieveUser();
    }

    menuItemClick() {
    }

    login() {       
        this.loginComponent.open();        
    }

    logout() {
        this.authService.logout();
    }    

    loginComponent_Closed(result: DialogResult) {

        (result == DialogResult.OK) && this.retrieveUser();        
    }

    /**
     * Извлечь сохраненные данные
     */
    retrieveUser() {
        this.loggedUser = this.authService.LoggedUser;

        // Фильтр меню для текущего пользователя
        let predicatesFor: Array<(mi: MenuItem, index: number, array: MenuItem[]) => any> = [],
            predicatesNot: Array<(mi: MenuItem, index: number, array: MenuItem[]) => any> = [];
        
        if (this.loggedUser.isadmin) {
            predicatesFor.push(v => v.for.findIndex(i => i.toLowerCase() === AdministratorsGroup.toLowerCase()) != -1);
            predicatesNot.push(v => v.not.findIndex(i => i.toLowerCase() === AdministratorsGroup.toLowerCase()) === -1);
        }
        else {
            predicatesFor.push(v => v.for.findIndex(i => i.toLowerCase() === UsersGroup.toLowerCase()) != -1);
            predicatesNot.push(v => v.not.findIndex(i => i.toLowerCase() === UsersGroup.toLowerCase()) === -1);
        }

        predicatesFor.push(v => v.for.findIndex(i => i.toLowerCase() === this.loggedUser.username.toLowerCase()) != -1);        
        predicatesNot.push(v => v.not.findIndex(i => i.toLowerCase() === this.loggedUser.username.toLowerCase()) === -1);   
        
        this.menu = appMenu.filter(mi => {
            let found: boolean = true;
            
            // array [for]
            if (mi.for != undefined) {

                for (let pre of predicatesFor) {
                    if (found = pre.call(this, mi)) break;
                }    
            }

            // still not found --> array [not]
            if (!found && mi.not != undefined) {

                for (let pre of predicatesNot) {
                    if (found = pre.call(this, mi)) break;
                }
            }                        

            return found;
        });
       
        (this.menu.length > 0) && this.router.navigate([this.menu[0].route]);
    }

    toggleNavBar(e) {
        
        e.preventDefault();
        $('#pm-navigation').toggleClass('expanded');
    }
}