import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { AderenciaRoutingModule } from './aderencia-routing.module';
import { FilterModule } from '../filter/filter.module';

import { AderenciaComponent } from './aderencia.component';
import { CardParlamentarComponent } from './card-parlamentar/card-parlamentar.component';

@NgModule({
  declarations: [
    AderenciaComponent,
    CardParlamentarComponent,
  ],
  imports: [
    CommonModule,
    FilterModule,
    SharedModule,
    NgxPaginationModule,
    NgbModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    AderenciaRoutingModule
  ]
})
export class AderenciaModule { }
