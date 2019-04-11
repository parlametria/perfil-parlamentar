import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlinhamentoComponent } from './alinhamento.component';

const routes: Routes = [
  {
    path: '',
    component: AlinhamentoComponent,
    data: { animation: 'AlinhamentoComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlinhamentoRoutingModule { }
