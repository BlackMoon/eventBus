import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login.component";
import { IgDialogComponent, IgTextEditorComponent } from 'igniteui-angular2/igniteui.angular2';
import { AuthenticationService } from './service/index';
import { routing } from './app.routing';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, routing],
    declarations: [IgDialogComponent, IgTextEditorComponent, LoginComponent, AppComponent],
    bootstrap: [AppComponent],
    providers: [AuthenticationService]
})
export class AppModule { }