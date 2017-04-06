import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormComponent } from "./form.component";
import { IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

/**
 * Ui модуль
 */
@NgModule({  
    declarations: [FormComponent, IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent],
    exports: [FormComponent, IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, CommonModule], 
    imports: [CommonModule]   
})
export class UiModule { }