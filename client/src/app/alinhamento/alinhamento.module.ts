import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { AlinhamentoRoutingModule } from './alinhamento-routing.module';
import { FilterModule } from '../filter/filter.module';

import { AlinhamentoComponent } from './alinhamento.component';
import { CardParlamentarComponent } from './card-parlamentar/card-parlamentar.component';

@NgModule({
  declarations: [
    AlinhamentoComponent,
    CardParlamentarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPaginationModule,
    NgbModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    SharedModule,
    AlinhamentoRoutingModule,
    FilterModule
  ]
})
export class AlinhamentoModule { }
