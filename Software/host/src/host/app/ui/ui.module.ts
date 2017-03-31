import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

/**
 * Ui модуль
 */
@NgModule({  
    declarations: [IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent],
    exports: [IgDialogComponent, IgLayoutManagerComponent, IgSplitterComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, CommonModule], 
    imports: [CommonModule]   
})
export class UiModule { }