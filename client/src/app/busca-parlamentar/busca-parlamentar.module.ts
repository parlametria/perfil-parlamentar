import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgxPaginationModule } from 'ngx-pagination';
import { LazyLoadImageModule, intersectionObserverPreset } from 'ng-lazyload-image';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from '../shared/components/shared.module';
import { BuscaParlamentarRoutingModule } from './busca-parlamentar-routing.module';

import { BuscaParlamentarComponent } from './busca-parlamentar.component';

@NgModule({
  declarations: [
    BuscaParlamentarComponent
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
    BuscaParlamentarRoutingModule
  ]
})
export class BuscaParlamentarModule { }

