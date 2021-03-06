import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './modules/core/components/navbar/navbar.component';
import { SharedModule } from './modules/shared/shared.module';
import { ProjectStore } from './modules/projects/project.store';
import { LoginComponent } from './modules/core/components/login/login.component';
import { RegisterComponent } from './modules/core/components/register/register.component';
import { CoreModule } from './modules/core/core.module';
import { MyProjectsComponent } from './modules/projects/my-projects/my-projects.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    MyProjectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    CoreModule,
  ],
  providers: [ProjectStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
