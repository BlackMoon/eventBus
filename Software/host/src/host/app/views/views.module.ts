import { NgModule } from "@angular/core";
import { IgTreeGridComponent } from 'igniteui-angular2/igniteui.angular2';
import * as views from './index';

@NgModule({
    declarations: [IgTreeGridComponent, views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    exports: [IgTreeGridComponent, views.MonitorView, views.PageNotFoundView, views.UsersTreeView]    
})
export class ViewsModule { }