import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AuthModule } from "./auth/auth.module";
import { AppComponent } from "./app.component";
// todo navigationmodule
import { routing } from './app.routing';

@NgModule({
    imports: [AuthModule.forRoot(), BrowserModule, routing],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule { }