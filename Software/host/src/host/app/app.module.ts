import { NgModule } from "@angular/core";
import { HttpModule } from '@angular/http';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';

import { AuthModule } from "./modules/auth.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login.component";
import { IgDialogComponent, IgTextEditorComponent } from 'igniteui-angular2/igniteui.angular2';
import { AuthenticationService } from './services/index';
import { routing } from './app.routing';

@NgModule({
    imports: [AuthModule, BrowserModule, FormsModule, HttpModule, routing],
    declarations: [IgDialogComponent, IgTextEditorComponent, LoginComponent, AppComponent],
    bootstrap: [AppComponent],
    providers: [AuthenticationService]
})
export class AppModule { }