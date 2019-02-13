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
import { HomeComponent } from './main/home/home.component';
import { PerguntasContainerComponent } from './questionario/perguntas-container/perguntas-container.component';
import { PerguntaComponent } from './questionario/pergunta/pergunta.component';
import { QuestionarioComponent } from './main/questionario/questionario.component';
import { TemasComponent } from './main/questionario/temas/temas.component';

import { PerguntaService } from './shared/services/pergunta.service';
import { LoginService } from './shared/services/login.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { TemaService } from './shared/services/tema.service';

import { getAuthServiceConfigs } from "./shared/config/socialLoginConfig";
import { TokenInterceptor } from "./shared/auth/token.interceptor";



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    PerguntasContainerComponent,
    PerguntaComponent,
    QuestionarioComponent,
    TemasComponent
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
    TemaService,    
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
