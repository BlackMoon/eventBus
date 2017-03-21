import { Component } from '@angular/core';

@Component({
    selector: 'app-logger',
    templateUrl: 'logger.component.html'
})
export class LoggerComponent {
    private dialogOptions: any;     

    constructor() {
        this.dialogOptions = {};
    }
}