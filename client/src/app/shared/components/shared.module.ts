import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from './navbar/navbar.component';
import { StickyFooterNavbarComponent } from './sticky-footer-navbar/sticky-footer-navbar.component';
import { ProgressComponent } from './progress/progress.component';
import { ProgressStackedComponent } from './progress-stacked/progress-stacked.component';
import { LoadingComponent } from './loading/loading.component';
import { LegendComponent } from './legend/legend.component';
import { AboutComponent } from './about/about.component';
import { Step01Component } from './about/step01/step01.component';
import { Step02Component } from './about/step02/step02.component';
import { Step03Component } from './about/step03/step03.component';

@NgModule({
  declarations: [
    NavbarComponent,
    StickyFooterNavbarComponent,
    ProgressComponent,
    ProgressStackedComponent,
    LoadingComponent,
    LegendComponent,
    AboutComponent,
    Step01Component,
    Step02Component,
    Step03Component
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
  ],
  exports: [
    NavbarComponent,
    StickyFooterNavbarComponent,
    ProgressComponent,
    ProgressStackedComponent,
    LoadingComponent,
    LegendComponent,
    AboutComponent
  ]
})
export class SharedModule { }
