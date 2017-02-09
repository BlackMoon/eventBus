import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { IgDialogComponent } from 'igniteui-angular2/igniteui.angular2';

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, IgDialogComponent],
    bootstrap: [AppComponent],
    providers: []
})
export class AppModule { }