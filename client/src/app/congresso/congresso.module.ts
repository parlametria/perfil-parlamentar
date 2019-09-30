import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CongressoRoutingModule } from './congresso-routing.module';
import { FilterModule } from '../filter/filter.module';
import { SharedModule } from '../shared/components/shared.module';

import { CongressoAlinhamentoComponent } from './congresso-alinhamento/congresso-alinhamento.component';
import { CongressoChartComponent } from './congresso-chart/congresso-chart.component';
import { CongressoAderenciaComponent } from './congresso-aderencia/congresso-aderencia.component';

@NgModule({
  declarations: [
    CongressoAlinhamentoComponent,
    CongressoChartComponent,
    CongressoAderenciaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CongressoRoutingModule,
    FilterModule
  ]
})
export class CongressoModule { }
