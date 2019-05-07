import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { ParlamentarRoutingModule } from './parlamentar-routing.module';

import { ParlamentarComponent } from './parlamentar.component';
import { PosicaoComponent } from './posicao/posicao.component';
import { CargoComponent } from './cargo/cargo.component';

@NgModule({
  declarations: [
    ParlamentarComponent,
    PosicaoComponent,
    CargoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    NgbModule,
    SharedModule,
    ParlamentarRoutingModule
  ]
})
export class ParlamentarModule { }
