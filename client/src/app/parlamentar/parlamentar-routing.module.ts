import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParlamentarComponent } from './parlamentar.component';
import { VotacoesComponent } from './votacoes/votacoes.component';
import { PosicoesComponent } from './posicoes/posicoes.component';
import { CargosComponent } from './cargos/cargos.component';
import { AderenciaComponent } from './aderencia/aderencia.component';
import { CapitalComponent } from './capital/capital.component';
import { TrajetoriaComponent } from './trajetoria/trajetoria.component';
import { PatrimonioComponent } from './patrimonio/patrimonio.component';
import { DespesasCotaParlamentarComponent } from './despesas-cota-parlamentar/despesas-cota-parlamentar.component';
import { VinculosComponent } from './vinculos/vinculos.component';

const routes: Routes = [
  {
    path: ':id',
    component: ParlamentarComponent,
    data: { animation: 'ParlamentarComponent' },
    children: [
      {
        path: '',
        redirectTo: 'votacoes',
        pathMatch: 'full'
      },
      {
        path: 'votacoes',
        component: VotacoesComponent
      },
      {
        path: 'posicoes',
        component: PosicoesComponent
      },
      {
        path: 'cargos',
        component: CargosComponent
      },
      {
        path: 'aderencia',
        component: AderenciaComponent
      },
      {
        path: 'peso',
        component: CapitalComponent
      },
      {
        path: 'trajetoria',
        component: TrajetoriaComponent
      },
      {
        path: 'patrimonio',
        component: PatrimonioComponent
      },
      {
        path: 'despesas',
        component: DespesasCotaParlamentarComponent
      },
      {
        path: 'vinculos',
        component: VinculosComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParlamentarRoutingModule { }
