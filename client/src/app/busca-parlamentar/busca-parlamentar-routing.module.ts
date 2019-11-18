import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuscaParlamentarComponent } from './busca-parlamentar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'camara'
  },
  {
    path: ':casa',
    component: BuscaParlamentarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuscaParlamentarRoutingModule { }
