import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login.component";
import { IgDialogComponent, IgTextEditorComponent } from 'igniteui-angular2/igniteui.angular2';

@NgModule({
    imports: [BrowserModule],
    declarations: [IgDialogComponent, IgTextEditorComponent, LoginComponent, AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }