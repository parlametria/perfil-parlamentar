import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AderenciaRoutingModule } from './aderencia-routing.module';
import { FilterModule } from '../filter/filter.module';

import { AderenciaComponent } from './aderencia.component';

@NgModule({
  declarations: [AderenciaComponent],
  imports: [
    CommonModule,
    FilterModule,
    AderenciaRoutingModule
  ]
})
export class AderenciaModule { }
