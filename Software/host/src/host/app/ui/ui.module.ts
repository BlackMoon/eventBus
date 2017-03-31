import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IgDialogComponent, IgLayoutManagerComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';

/**
 * Ui модуль
 */
@NgModule({  
    declarations: [IgDialogComponent, IgLayoutManagerComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent],
    exports: [IgDialogComponent, IgLayoutManagerComponent, IgTextEditorComponent, IgTreeGridComponent, IgValidatorComponent, CommonModule], 
    imports: [CommonModule]   
})
export class UiModule { }