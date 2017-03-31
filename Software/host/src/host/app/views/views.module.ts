import { NgModule } from "@angular/core";
import { UiModule } from "../ui/ui.module";
import * as views from '.';

@NgModule({
    entryComponents: [views.QueryView],
    declarations: [views.MonitorView, views.PageNotFoundView, views.QueryView, views.UsersTreeView],
    exports: [views.MonitorView, views.PageNotFoundView, views.QueryView, views.UsersTreeView],
    imports: [UiModule]    
})
export class ViewsModule { }