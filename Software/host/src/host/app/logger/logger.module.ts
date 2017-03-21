import { NgModule } from '@angular/core';
import { IgniteUIModule } from "../igniteui.module";
import { LoggerComponent } from './logger.component';
import { LoggerService } from './logger.service';

@NgModule({
    declarations: [ LoggerComponent],    
    exports: [LoggerComponent],
    imports: [IgniteUIModule],
    providers: [LoggerService]
})
export class LoggerModule { }