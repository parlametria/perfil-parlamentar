import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { PerguntaService } from './shared/services/pergunta.service';
import { LoginService } from './shared/services/login.service';
import { AuthGuardService } from './shared/services/auth-guard.service';

import { getAuthServiceConfigs } from "./shared/config/socialLoginConfig";
import { TokenInterceptor } from "./shared/auth/token.interceptor";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule
  ],
  providers: [
    PerguntaService,
    LoginService,
    AuthGuardService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,      
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
