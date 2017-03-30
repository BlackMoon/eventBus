import { NgModule } from '@angular/core';
import { UiModule } from "../ui/ui.module";
import { LoggerComponent } from './logger.component';
import { LoggerService } from './logger.service';

@NgModule({
    declarations: [ LoggerComponent],    
    exports: [LoggerComponent],
    imports: [ UiModule ],
    providers: [LoggerService]
})
export class LoggerModule { }