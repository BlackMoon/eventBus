import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from "./app.component";
import { AuthService } from './services/index';
import { AuthModule, LoginComponent, NavigationModule } from "./modules/index";
import { PageNotFoundComponent } from "./components/index";
import { HomeView } from "./views/index";
import { IgDialogComponent, IgTextEditorComponent, IgValidatorComponent } from 'igniteui-angular2/igniteui.angular2';
import { routing } from './app.routing';

@NgModule({
    imports: [AuthModule, BrowserModule, FormsModule, HttpModule, NavigationModule, routing],
    declarations: [AppComponent, IgDialogComponent, IgTextEditorComponent, IgValidatorComponent, HomeView, LoginComponent, PageNotFoundComponent],
    bootstrap: [AppComponent],
    providers: [AuthService]
})
export class AppModule { }