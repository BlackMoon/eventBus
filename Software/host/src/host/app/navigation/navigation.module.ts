import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { NavigationService } from './navigation.service';
import { RouterModule, Router, Routes } from '@angular/router';
import { PageNotFoundView } from '../views/index'
import { Injector } from '@angular/core';
import { SelectivePreloadingStrategy } from './selective-preloading-strategy';

const appRoutes: Routes = [
    { path: '**', component: PageNotFoundView }    
];

@NgModule({
    declarations: [PageNotFoundView],    
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