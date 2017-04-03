import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Http, RequestOptions, URLSearchParams } from '@angular/http';
import { Params, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login.component';
import { RouterConfig } from './navigation/router.config';
import { AdkUserModel, MenuItem, AdministratorsGroup, UsersGroup } from './models/index';
import { appMenu } from './app.menu';
import { DialogResult } from './ui/utils';

declare var $: any;
const startViewKey = 'returnUrl';

@Component({
    host: { '(window:resize)': 'onResize($event)' },
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit, OnInit {    
    @ViewChild(LoginComponent) loginComponent: LoginComponent;
    
    private $headline;
    private $navigation;
    private $view;
    private $settings;

    private menu: Array<MenuItem> = [];
    private loggedUser: AdkUserModel;
    /**
     * Стартовая страница
     */
    private startView: string;    

    constructor(
        private authService: AuthService,       
        private router: Router,
        private routerConfig: RouterConfig) {
        this.startView = new URLSearchParams(window.location.search.slice(1)).get(startViewKey);         
    }

    ngAfterViewInit() {    

        this.$navigation = $("#pm-navigation").mCustomScrollbar({
            theme: "dark",
            axis: "y"
        });

        this.$headline = $("#project-panel #headline");
        this.$view = $("#project-panel #view");
        this.$settings = $("#pm-team-navigation");

        this.onResize();

        if (this.authService.isAuthenticated) {
            // start redirect
            if (this.startView != undefined) {
                if (this.menu.length > 0) {
                    let mi: MenuItem = this.menu.find(item => item.route.toLowerCase() === this.startView);
                    this.menuItemClick(mi);
                }
                else
                    this.router.navigate([this.startView]);
            }
            else {                
                (this.menu.length > 0) && this.menuItemClick(this.menu[0]);                
            }            
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

        if (item != null) {
            this.router.navigateByUrl(item.route);
            this.menu.forEach(mi => mi.active = false);
            item.active = true;
        }
    }

    login() {        
        
        this.loginComponent.open();
        this.$navigation.switchClass('expanded', 'collapsed'); // collapse navigation  
    }

    logout() {
        this.authService.logout();
    }    

    loginComponentClosed(result: DialogResult) {

        if (result === DialogResult.OK) {
            this.retrieveUser();
            (this.menu.length > 0) && this.menuItemClick(this.menu[0]);
        }
    }

    onResize() {
        this.$view.height(window.innerHeight - this.$headline.height() - 11 /*headline padding*/);
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
            predicatesFor.push(v => v.for.findIndex(i => i.toLowerCase() === AdministratorsGroup.toLowerCase()) !== -1);
            predicatesNot.push(v => v.not.findIndex(i => i.toLowerCase() === AdministratorsGroup.toLowerCase()) === -1);
        }
        else {
            predicatesFor.push(v => v.for.findIndex(i => i.toLowerCase() === UsersGroup.toLowerCase()) !== -1);
            predicatesNot.push(v => v.not.findIndex(i => i.toLowerCase() === UsersGroup.toLowerCase()) === -1);
        }

        predicatesFor.push(v => v.for.findIndex(i => i.toLowerCase() === this.loggedUser.username.toLowerCase()) !== -1);        
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

    toggleTeamBar(e) {
       
        e.preventDefault();                
        this.$settings[$(e.currentTarget).hasClass('slide-team-directory') ? 'addClass' : 'removeCalss']('directory-view');

        // collapsed --> expand
        if (this.$settings.hasClass('collapsed'))
        {
            // Handles Open animation for Team Resource Selection Slide
            if (this.$settings.hasClass('directory-view'))
            {

                $('#project-panel #headline .action.slide-team-directory')
                    .animate({ "right": "351px", "easing": "easeInQuad" }, 50)
                    .css({ 'position': 'fixed' });

                this.$settings
                    .animate({ "right": "0px", "easing": "easeInQuad" }, 50)
                    .switchClass('collapsed', 'expanded');                                
            }
            else
            {
                this.$settings
                    .animate({ "right": '0px', easing: "easeInQuad" }, 50)
                    .switchClass('collapsed', 'expanded');           
            
            }
        }
        // expanded --> collapse
        else
        {
            if (this.$settings.css('right') === '0px')
            {
                let tdWidth = this.$settings.outerWidth();
                if (this.$settings.hasClass('directory-view'))
                {
                    $('#project-panel #headline .action.slide-team-directory')
                        .animate({ "right": "0px", "easing": "easeInQuad" }, 0)
                        .css({ 'position': 'absolute' });

                    this.$settings.switchClass('expanded', 'collapsed')
                        .animate({ "right": '-' + (tdWidth + 350) + 'px', "easing": "easeInQuad" }, 0);
                }
                else
                {
                    this.$settings
                        .switchClass('expanded', 'collapsed')
                        .animate({"right": '-' + (tdWidth + 350) + 'px', easing: "easeOutQuad" }, 0);
                }
            }
        }        
    }
}