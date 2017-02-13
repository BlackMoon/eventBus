import { Component } from '@angular/core';

declare var $: any;

@Component({
    selector: 'eventBus-app',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})

export class AppComponent {
    title = "Angular 2 Test";

    private options: any;

    constructor() {
        this.options = {
            headerText: "Foo",
            height: "325px"
        };
    }

    ngAfterViewInit() {
        //debugger;
        var $el = $("#pm-dashboard");
        //$el.mCustomScrollbar();
    }
}