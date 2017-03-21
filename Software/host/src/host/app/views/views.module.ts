import { NgModule } from "@angular/core";
import { IgniteUIModule } from "../igniteui.module";
import * as views from './index';

@NgModule({
    declarations: [ views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    exports: [views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    imports: [IgniteUIModule]    
})
export class ViewsModule { }