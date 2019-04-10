import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgxPaginationModule } from 'ngx-pagination';

import { getAuthServiceConfigs } from './shared/config/socialLoginConfig';
import { TokenInterceptor } from './shared/auth/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { MainModule } from './main/main.module';
import { SharedModule } from './shared/components/shared.module';
import { ParlamentarModule } from './parlamentar/parlamentar.module';
import { QuestionarioModule } from './questionario/questionario.module';
import { UserModule } from './user/user.module';

import { AppComponent } from './app.component';
import { AlinhamentoComponent } from './main/alinhamento/alinhamento.component';
import { FilterComponent } from './main/alinhamento/filter/filter.component';
import { CardParlamentarComponent } from './main/alinhamento/card-parlamentar/card-parlamentar.component';

import { PerguntaService } from './shared/services/pergunta.service';
import { LoginService } from './shared/services/login.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { TemaService } from './shared/services/tema.service';
import { UserService } from './shared/services/user.service';
import { AlinhamentoService } from './shared/services/alinhamento.service';
import { ParlamentarService } from './shared/services/parlamentar.service';

@NgModule({
  declarations: [
    AppComponent,
    AlinhamentoComponent,
    FilterComponent,
    CardParlamentarComponent    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    NgxPaginationModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    MainModule,
    ParlamentarModule,
    QuestionarioModule,
    UserModule
  ],
  providers: [
    PerguntaService,
    LoginService,
    AuthGuardService,
    TemaService,
    UserService,
    AlinhamentoService,
    ParlamentarService,
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
