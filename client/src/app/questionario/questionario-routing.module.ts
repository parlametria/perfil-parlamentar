import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionarioComponent } from './questionario.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionarioComponent,
    data: { animation: 'QuestionarioComponent' }
  },
  {
    path: ':id',
    component: QuestionarioComponent,
    data: { animation: 'QuestionarioComponent' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionarioRoutingModule { }
