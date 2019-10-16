import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';

import { ParlamentarInfo } from 'src/app/shared/models/parlamentarInfo.model';

@Component({
  selector: 'app-parlamentar',
  templateUrl: './parlamentar.component.html',
  styleUrls: ['./parlamentar.component.scss']
})
export class ParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  parlamentar: ParlamentarInfo;

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
      .getInfoById(id)
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

  getCargoParlamentar(casa: string) {
    if (casa === 'camara') {
      return 'Câmara';
    } else if (casa === 'senado') {
      return 'Senado';
    } else {
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
