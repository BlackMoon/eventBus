import { Component } from '@angular/core';

@Component({
    selector: 'eventBus-app',
    styles: [require('to-string!./app.component.css')],
    template: require('to-string!./app.component.html')
})
export class AppComponent {
    title = "Angular 2 Test";
}