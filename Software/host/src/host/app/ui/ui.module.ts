import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { JqueryUiButtonComponent } from "./jqueryui.angular2";
import { FormComponent } from "./form.component";
import { IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

/**
 * Ui модуль
 */
@NgModule({  
    declarations: [FormComponent, IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, JqueryUiButtonComponent],
    exports: [FormComponent, IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, JqueryUiButtonComponent, CommonModule], 
    imports: [CommonModule]   
})
export class UiModule { }