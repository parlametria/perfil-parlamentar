import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AderenciaComponent } from './aderencia.component';
import { AderenciaRoutingModule } from './aderencia-routing.module';

@NgModule({
  declarations: [AderenciaComponent],
  imports: [
    CommonModule,
    AderenciaRoutingModule
  ]
})
export class AderenciaModule { }
