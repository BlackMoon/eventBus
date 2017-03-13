import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AuthModule, LoginComponent } from "./modules/auth.module";
import { AppComponent } from "./app.component";
import { IgDialogComponent, IgTextEditorComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';
import { AuthService } from './services/index';
import { routing } from './app.routing';

@NgModule({
    imports: [AuthModule, BrowserModule, FormsModule, HttpModule, routing],
    declarations: [AppComponent, IgDialogComponent, IgTextEditorComponent, IgValidatorComponent, LoginComponent],
    bootstrap: [AppComponent],
    providers: [AuthService]
})
export class AppModule { }