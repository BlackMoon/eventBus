import { AfterViewInit, Component, OnInit, Renderer, ViewChild } from '@angular/core';
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
    
    private $navigation;
    private menu: Array<MenuItem> = [];
    private loggedUser: AdkUserModel;    

    constructor(
        private authService: AuthService,        
        private render: Renderer,
        private router: Router,
        private routerConfig: RouterConfig)
    {        
    }

    ngAfterViewInit() {    

        this.$navigation = $("#pm-navigation").mCustomScrollbar({
            theme: "dark",
            axis: 'y'
        }); 

        if (this.authService.isAuthenticated)
        {
            (this.menu.length > 0) && this.menuItemClick(this.menu[0]);
        }
        else
            this.login();        
    }    

    ngOnInit() {

        // Маршруты        
        let config = this.routerConfig.Routes.concat(this.router.config);
        this.router.resetConfig(config);               

        // Данные
        (this.authService.isAuthenticated) && this.retrieveUser();       
    }

    menuItemClick(item: MenuItem) {
       
        this.$navigation.switchClass('expanded', 'collapsed'); // collapse navigation        
        
        this.router.navigate([item.route]);
        this.menu.forEach(mi => mi.active = false);
        item.active = true;        
    }

    login() {        
        
        this.loginComponent.open();
        this.$navigation.switchClass('expanded', 'collapsed'); // collapse navigation  
    }

    logout() {
        this.authService.logout();
    }    

    loginComponent_Closed(result: DialogResult) {

        if (result == DialogResult.OK) {
            this.retrieveUser();
            (this.menu.length > 0) && this.menuItemClick(this.menu[0]);
        }
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
    }

    toggleNavBar(e) {
        
        e.preventDefault();
        this.$navigation.toggleClass('expanded');
    }
}