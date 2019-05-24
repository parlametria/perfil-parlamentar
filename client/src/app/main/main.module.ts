import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainRoutingModule } from './main-routing.module';
import { SharedModule } from '../shared/components/shared.module';

import { HomeComponent } from './home/home.component';
import { SobreComponent } from './sobre/sobre.component';

@NgModule({
  declarations: [
    HomeComponent,
    SobreComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MainRoutingModule
  ]
})
export class MainModule { }
