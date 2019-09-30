import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CongressoAlinhamentoComponent } from './congresso-alinhamento/congresso-alinhamento.component';
import { CongressoAderenciaComponent } from './congresso-aderencia/congresso-aderencia.component';

const routes: Routes = [
  {
    path: 'aderencia/:casa',
    component: CongressoAderenciaComponent,
    data: { animation: 'CongressoAderenciaComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongressoRoutingModule { }
