import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

import { PerguntaService } from './shared/services/pergunta.service';
import { LoginService } from './shared/services/login.service';
import { AuthGuardService } from './shared/services/auth-guard.service';

import { getAuthServiceConfigs } from "./shared/config/socialLoginConfig";
import { TokenInterceptor } from "./shared/auth/token.interceptor";
import { PerguntasComponent } from './questionario/perguntas/perguntas.component';
import { PerguntaComponent } from './questionario/pergunta/pergunta.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    PerguntasComponent,
    PerguntaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    FormsModule,
    NgbModule.forRoot()
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
