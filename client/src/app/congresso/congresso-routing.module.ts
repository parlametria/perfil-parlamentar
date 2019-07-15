import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CongressoComponent } from './congresso.component';
import { CongressoAderenciaComponent } from './congresso-aderencia/congresso-aderencia.component';

const routes: Routes = [
  {
    path: '',
    component: CongressoComponent,
    data: { animation: 'CongressoComponent' }
  },
  {
    path: 'aderencia',
    component: CongressoAderenciaComponent,
    data: { animation: 'CongressoAderenciaComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongressoRoutingModule { }
