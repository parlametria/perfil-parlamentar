import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { AppComponent } from './app.component';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { HomeComponent } from './main/home/home.component';
import { QuestionarioComponent } from './main/questionario/questionario.component';
import { PerguntasContainerComponent } from './questionario/perguntas-container/perguntas-container.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'questionario', component: QuestionarioComponent },  
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
