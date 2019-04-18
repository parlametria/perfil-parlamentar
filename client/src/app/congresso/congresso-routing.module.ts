import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CongressoComponent } from './congresso.component';

const routes: Routes = [
  {
    path: '',
    component: CongressoComponent,
    data: { animation: 'CongressoComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongressoRoutingModule { }
