import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './main/home/home.component';
import { QuestionarioComponent } from './main/questionario/questionario.component';
import { AlinhamentoComponent } from './main/alinhamento/alinhamento.component';
import { ParlamentarComponent } from './main/parlamentar/parlamentar.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { animation: 'HomeComponent' } },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginComponent' } },
  { path: 'questionario', component: QuestionarioComponent, data: { animation: 'QuestionarioComponent' } },
  { path: 'alinhamento', component: AlinhamentoComponent, data: { animation: 'AlinhamentoComponent' } },
  { path: 'parlamentar/:cpf', component: ParlamentarComponent, data: { animation: 'ParlamentarComponent' } },
  { path: '**', component: HomeComponent, data: { animation: 'HomeComponent' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
