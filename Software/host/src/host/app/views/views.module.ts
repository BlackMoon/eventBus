import { NgModule } from "@angular/core";
import { AppUIModule } from "../app-ui.module";
import * as views from './index';

@NgModule({
    declarations: [ views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    exports: [views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    imports: [AppUIModule]    
})
export class ViewsModule { }