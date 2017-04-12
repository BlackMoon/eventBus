import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { RouterConfig } from './router.config';
import { RouterModule, Router, Routes } from '@angular/router';
import { Injector } from '@angular/core';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';
import * as views from '../views';

const appRoutes: Routes = [    
    { path: '**', component: views.PageNotFoundView }    
];

@NgModule({    
    entryComponents: [views.MonitorView, views.UsersTreeView],
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
            providers: [
                RouterConfig,
                { provide: APP_INITIALIZER, useFactory: (config: RouterConfig) => () => config.load(), deps: [RouterConfig], multi: true },
                SelectivePreloadingStrategy]                
        }
    }
}