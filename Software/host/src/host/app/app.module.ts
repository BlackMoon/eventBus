import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AuthModule } from "./auth/auth.module";
import { NavigationModule } from "./navigation/navigation.module";
import { ViewsModule } from "./views/views.module";
import { AppComponent } from "./app.component";

@NgModule({    
    bootstrap: [AppComponent],
    declarations: [AppComponent],    
    imports: [AuthModule.forRoot(), BrowserModule, NavigationModule.forRoot(), ViewsModule]
})
export class AppModule { }