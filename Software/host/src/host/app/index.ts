import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode, ComponentRef } from '@angular/core';
import { AppModule } from './app.module';

if (process.env.ENV === 'production') {
    enableProdMode();
}

let boot = document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic()
        .bootstrapModule(AppModule);        
});

module.exports = boot;