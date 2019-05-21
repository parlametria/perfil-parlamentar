import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './main/main.module#MainModule' },
  { path: 'usuario', loadChildren: './user/user.module#UserModule' },
  { path: 'questionario', loadChildren: './questionario/questionario.module#QuestionarioModule' },
  { path: 'alinhamento', loadChildren: './alinhamento/alinhamento.module#AlinhamentoModule' },
  { path: 'parlamentar', loadChildren: './parlamentar/parlamentar.module#ParlamentarModule' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
