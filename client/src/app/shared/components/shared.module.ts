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
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavbarComponent,
    StickyFooterNavbarComponent,
    ProgressComponent,
    ProgressStackedComponent,
    LoadingComponent,
    LegendComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    NavbarComponent,
    StickyFooterNavbarComponent,
    ProgressComponent,
    ProgressStackedComponent,
    LoadingComponent,
    LegendComponent,
    FooterComponent
  ]
})
export class SharedModule { }
