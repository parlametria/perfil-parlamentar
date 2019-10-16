import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AderenciaComponent } from './aderencia.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'camara'
  },
  {
    path: ':casa',
    component: AderenciaComponent,
    data: { animation: 'AderenciaComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AderenciaRoutingModule { }
