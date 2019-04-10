import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';

import { ParlamentarComponent } from './parlamentar.component';
import { PosicaoComponent } from './posicao/posicao.component';

@NgModule({
  declarations: [
    ParlamentarComponent,
    PosicaoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    NgbModule.forRoot(),
    SharedModule
  ]
})
export class ParlamentarModule { }
