import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { NavigationService } from './navigation.service';
import { RouterModule, Router, Routes } from '@angular/router';
import { Injector } from '@angular/core';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';

import * as views from '../views';

const appRoutes: Routes = [   
    { path: '**', component: views.PageNotFoundView }    
];

@NgModule({
    declarations: [views.PageNotFoundView, views.UsersTreeView],    
    exports: [RouterModule],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { preloadingStrategy: SelectivePreloadingStrategy }
        )
    ]
})
export class NavigationModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NavigationModule,
            providers: [NavigationService, SelectivePreloadingStrategy]                
        }
    }
}