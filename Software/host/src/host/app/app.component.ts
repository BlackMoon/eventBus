import { Component } from '@angular/core';
import "malihu-custom-scrollbar-plugin/jquery.mCustomScrollBar";

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styles: [require('to-string!./app.component.css')],
    templateUrl: './app.component.html'
})
export class AppComponent {
    title = "Angular 2 Test";
    
    ngAfterViewInit() {
       
        $("#pm-dashboard").draggable();
    }
}