import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
  { path: 'usuario', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  // { path: 'questionario', loadChildren: './questionario/questionario.module#QuestionarioModule' },
  // { path: 'alinhamento', loadChildren: './alinhamento/alinhamento.module#AlinhamentoModule' },
  { path: 'parlamentar', loadChildren: () => import('./parlamentar/parlamentar.module').then(m => m.ParlamentarModule) },
  // { path: 'congresso', loadChildren: './congresso/congresso.module#CongressoModule' },
  { path: 'aderencia', loadChildren: () => import('./aderencia/aderencia.module').then(m => m.AderenciaModule) },
  { path: 'parlamentares', loadChildren: () => import('./busca-parlamentar/busca-parlamentar.module').then(m => m.BuscaParlamentarModule) },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
