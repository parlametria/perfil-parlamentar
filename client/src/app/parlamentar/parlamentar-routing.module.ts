import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParlamentarComponent } from './parlamentar.component';
import { PosicoesComponent } from './posicoes/posicoes.component';
import { CargosComponent } from './cargos/cargos.component';

const routes: Routes = [
  {
    path: ':id',
    component: ParlamentarComponent,
    data: { animation: 'ParlamentarComponent' },
    children: [
      {
        path: '',
        redirectTo: 'posicoes',
        pathMatch: 'full'
      },
      {
        path: 'posicoes',
        component: PosicoesComponent
      },
      {
        path: 'cargos',
        component: CargosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParlamentarRoutingModule { }
