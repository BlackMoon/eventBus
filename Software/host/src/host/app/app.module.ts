import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { AuthModule } from "./auth/auth.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./auth/login.component";
// todo navigationmodule
import { routing } from './app.routing';

@NgModule({
    imports: [AuthModule.forRoot(), BrowserModule, FormsModule, routing],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }