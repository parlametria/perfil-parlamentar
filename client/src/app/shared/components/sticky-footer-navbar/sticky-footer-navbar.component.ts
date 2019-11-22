import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CasaService } from '../../services/casa.service';

@Component({
  selector: 'app-sticky-footer-navbar',
  templateUrl: './sticky-footer-navbar.component.html',
  styleUrls: ['./sticky-footer-navbar.component.scss']
})
export class StickyFooterNavbarComponent implements OnInit {

  private unsubscribe = new Subject();

  casa: string;

  constructor(private casaService: CasaService) { }

  ngOnInit() {
    this.casaService.get().pipe(takeUntil(this.unsubscribe)).subscribe(casa => this.casa = casa);
  }

  getCasa() {
    return this.casa;
  }

}
