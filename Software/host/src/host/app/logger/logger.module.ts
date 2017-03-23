import { NgModule } from '@angular/core';
import { AppUIModule } from "../app-ui.module";
import { LoggerComponent } from './logger.component';
import { LoggerService } from './logger.service';

@NgModule({
    declarations: [ LoggerComponent],    
    exports: [LoggerComponent],
    imports: [ AppUIModule ],
    providers: [LoggerService]
})
export class LoggerModule { }