import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CongressoRoutingModule } from './congresso-routing.module';
import { SharedModule } from '../shared/components/shared.module';

import { CongressoComponent } from './congresso.component';
import { CongressoChartComponent } from './congresso-chart/congresso-chart.component';
import { FilterComponent } from '../alinhamento/filter/filter.component';

@NgModule({
  declarations: [
    CongressoComponent,
    CongressoChartComponent,
    FilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    CongressoRoutingModule
  ]
})
export class CongressoModule { }
