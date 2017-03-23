﻿import { NgModule } from "@angular/core";
import { IgDialogComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

/**
 * AppUI модуль
 */
@NgModule({
    declarations: [IgDialogComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent],
    exports: [IgDialogComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent]
})
export class AppUIModule { }