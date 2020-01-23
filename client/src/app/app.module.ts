import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { getAuthServiceConfigs } from './shared/config/socialLoginConfig';
import { TokenInterceptor } from './shared/auth/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/components/shared.module';

import { AppComponent } from './app.component';

import { PerguntaService } from './shared/services/pergunta.service';
import { LoginService } from './shared/services/login.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { TemaService } from './shared/services/tema.service';
import { UserService } from './shared/services/user.service';
import { AlinhamentoService } from './shared/services/alinhamento.service';
import { ParlamentarService } from './shared/services/parlamentar.service';
import { AderenciaService } from './shared/services/aderencia.service';
import { CasaService } from './shared/services/casa.service';
import { UpdateService } from './shared/services/update.service';
import { VotacaoService } from './shared/services/votacao.service';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    NgbModule,
    AppRoutingModule,
    SharedModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    PerguntaService,
    LoginService,
    AuthGuardService,
    TemaService,
    UserService,
    AlinhamentoService,
    ParlamentarService,
    AderenciaService,
    CasaService,
    UpdateService,
    VotacaoService,
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
