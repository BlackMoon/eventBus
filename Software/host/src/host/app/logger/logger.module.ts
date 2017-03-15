import { NgModule } from '@angular/core';
import { LoggerComponent } from './logger.component';
import { LoggerService } from './logger.service';

@NgModule({
    declarations: [ LoggerComponent ],
    providers: [LoggerService]
})
export class LoggerModule { }