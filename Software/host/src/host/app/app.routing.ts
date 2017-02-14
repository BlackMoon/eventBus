import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const appRoutes: Routes = [
    // otherwise redirect to home
    { path: '**', redirectTo: '' }   
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);