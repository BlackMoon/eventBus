import { NgModule } from "@angular/core";
import { UiModule } from "../ui/ui.module";
import * as views from './index';

@NgModule({
    declarations: [ views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    exports: [views.MonitorView, views.PageNotFoundView, views.UsersTreeView],
    imports: [UiModule]    
})
export class ViewsModule { }