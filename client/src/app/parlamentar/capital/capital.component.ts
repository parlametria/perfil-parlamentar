import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { ParlamentarInvestimento } from 'src/app/shared/models/parlamentarInvestimento.model';
import { PartidoInvestimento } from 'src/app/shared/models/partidoInvestimento.model';

@Component({
  selector: 'app-capital',
  templateUrl: './capital.component.html',
  styleUrls: ['./capital.component.scss']
})
export class CapitalComponent implements OnInit {

  private unsubscribe = new Subject();

  parlamentar: ParlamentarInvestimento;
  partido: PartidoInvestimento;

  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
    });
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getInvestimentoById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentarService
            .getInvestimentoPartido(
              parlamentar.partidoEleicao.idPartido,
              parlamentar.parlamentarInvestimento.uf,
              parlamentar.parlamentarInvestimento.casa)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              partido => {
                parlamentar.partidoInvestimento = partido;
                this.parlamentar = parlamentar;
              }
            );

        },
        error => {
          console.log(error);
        }
      );
  }

}
