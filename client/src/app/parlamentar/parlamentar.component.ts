import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-parlamentar',
  templateUrl: './parlamentar.component.html',
  styleUrls: ['./parlamentar.component.scss']
})
export class ParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;

  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService
  ) { }

  ngOnInit() {
    const id = this.activatedroute.snapshot.paramMap.get('id');

    this.getParlamentarById(id);
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getVotacoesParlamentarPorId(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentar = parlamentar;
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
