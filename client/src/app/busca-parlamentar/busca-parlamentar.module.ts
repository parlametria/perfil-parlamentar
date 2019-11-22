import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { BuscaParlamentarRoutingModule } from './busca-parlamentar-routing.module';
import { FilterModule } from '../filter/filter.module';

import { BuscaParlamentarComponent } from './busca-parlamentar.component';
import { ListaParlamentaresComponent } from './lista-parlamentares/lista-parlamentares.component';
import { CardBuscaParlamentarComponent } from './card-busca-parlamentar/card-busca-parlamentar.component';

@NgModule({
  declarations: [
    BuscaParlamentarComponent,
    ListaParlamentaresComponent,
    CardBuscaParlamentarComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    NgbModule,
    LazyLoadImageModule.forRoot({
      preset: intersectionObserverPreset
    }),
    SharedModule,
    BuscaParlamentarRoutingModule,
    FilterModule
  ]
})
export class BuscaParlamentarModule { }

