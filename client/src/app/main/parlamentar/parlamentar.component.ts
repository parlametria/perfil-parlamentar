import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarService } from './../../shared/services/parlamentar.service';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-parlamentar',
  templateUrl: './parlamentar.component.html',
  styleUrls: ['./parlamentar.component.scss']
})
export class ParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;

  constructor(
    private parlamentarService: ParlamentarService
  ) { }

  ngOnInit() {
    this.getParlamentarByCpf();
  }

  getParlamentarByCpf() {
    this.parlamentarService.getVotacoesParlamentarPorCpf("08430005463").
      pipe(takeUntil(this.unsubscribe)).
      subscribe((parlamentar) => {
        this.parlamentar = parlamentar;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
