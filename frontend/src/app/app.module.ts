import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProgramChairComponent } from './components/program-chair/program-chair.component';
import { ProgramChairListComponent } from './components/program-chair-list/program-chair-list.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HeaderComponent } from './components/header/header.component';
import { LandingComponent } from './components/landing/landing.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProgramChairService } from './services/program-chair.service';

@NgModule({
  declarations: [
    AppComponent,
    ProgramChairComponent,
    ProgramChairListComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    LandingComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ProgramChairService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
