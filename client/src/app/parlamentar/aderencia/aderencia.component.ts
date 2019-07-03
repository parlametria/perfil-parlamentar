import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarInfo } from 'src/app/shared/models/parlamentarInfo.model';
import { Aderencia } from 'src/app/shared/models/aderencia.model';
import { AderenciaService } from 'src/app/shared/services/aderencia.service';
import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';

@Component({
  selector: 'app-aderencia',
  templateUrl: './aderencia.component.html',
  styleUrls: ['./aderencia.component.scss']
})
export class AderenciaComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  parlamentar: ParlamentarInfo;
  aderencia: Aderencia;
  aderenciaPartido: any;
  aderenciaGoverno: any;
  passo: number;
  passoGoverno: number;

  constructor(
    private parlamentarService: ParlamentarService,
    private aderenciaService: AderenciaService,
    private activatedroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
      this.getAderencia(params.id);
    });
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getInfoById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          console.log(parlamentar);
          this.parlamentar = parlamentar;
        },
        error => {
          console.log(error);
        }
      );
  }

  getAderencia(id: string) {
    this.aderenciaService.
      getAderenciaById(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        aderencia => {
          this.aderencia = aderencia;

          // Aderência ao partido
          this.aderenciaPartido = aderencia.parlamentarAderencia.filter(ad =>
            ad.partido.sigla === aderencia.parlamentarPartido.sigla && ad.aderenciaTema.idTema === 99)[0];

          if (this.aderenciaPartido !== undefined) {
            const total = this.aderenciaPartido.seguiu + this.aderenciaPartido.naoSeguiu +
              this.aderenciaPartido.partidoLiberou + this.aderenciaPartido.faltou;
            this.passo = 100 / total;
          } else {
            this.passo = 0;
          }

          // Aderência ao governo
          this.aderenciaGoverno = aderencia.parlamentarAderencia.filter(ad => ad.partido.sigla === 'GOVERNO')[0];

          if (this.aderenciaGoverno !== undefined) {
            const total = this.aderenciaGoverno.seguiu + this.aderenciaGoverno.naoSeguiu +
              this.aderenciaGoverno.partidoLiberou + this.aderenciaGoverno.faltou;
            this.passoGoverno = 100 / total;
          } else {
            this.passoGoverno = 0;
          }

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
