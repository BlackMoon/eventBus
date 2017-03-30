import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { QueryComponent } from "./query.component";
import { IgDialogComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

/**
 * Ui модуль
 */
@NgModule({
    entryComponents: [QueryComponent],
    declarations: [IgDialogComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, QueryComponent],
    exports: [IgDialogComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, CommonModule, QueryComponent], 
    imports: [CommonModule]   
})
export class UiModule { }