import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './components/index';
import { HomeView } from './views/index';

const appRoutes: Routes = [
    { path: 'home', component: HomeView }    
    
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);