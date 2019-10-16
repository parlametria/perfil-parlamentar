import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { AderenciaRoutingModule } from './aderencia-routing.module';
import { FilterModule } from '../filter/filter.module';

import { AderenciaComponent } from './aderencia.component';
import { AderenciaParlamentaresComponent } from './aderencia-parlamentares/aderencia-parlamentares.component';
import { CardParlamentarComponent } from './card-parlamentar/card-parlamentar.component';
import { CongressoChartLegendaComponent } from './congresso-chart-legenda/congresso-chart-legenda.component';
import { CongressoChartComponent } from './congresso-chart/congresso-chart.component';

@NgModule({
  declarations: [
    AderenciaComponent,
    AderenciaParlamentaresComponent,
    CardParlamentarComponent,
    CongressoChartLegendaComponent,
    CongressoChartComponent
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
