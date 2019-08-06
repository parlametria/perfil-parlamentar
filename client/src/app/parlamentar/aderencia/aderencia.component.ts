import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { AderenciaService } from 'src/app/shared/services/aderencia.service';
import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { TemaService } from 'src/app/shared/services/tema.service';

import { ParlamentarInfo } from 'src/app/shared/models/parlamentarInfo.model';
import { Aderencia } from 'src/app/shared/models/aderencia.model';
import { Tema } from 'src/app/shared/models/tema.model';

@Component({
  selector: 'app-aderencia',
  templateUrl: './aderencia.component.html',
  styleUrls: ['./aderencia.component.scss']
})
export class AderenciaComponent implements OnInit, OnDestroy {
  readonly ID_PARTIDO_GOVERNO = 0;

  readonly ID_TEMA_ADERENCIA_GERAL = '99';

  private unsubscribe = new Subject();

  parlamentar: ParlamentarInfo;
  aderencia: Aderencia;
  aderenciaPartido: any;
  aderenciaGoverno: any;
  passo: number;
  passoGoverno: number;

  temas: Tema[];
  temaSelecionado: string;

  constructor(
    private parlamentarService: ParlamentarService,
    private aderenciaService: AderenciaService,
    private temaService: TemaService,
    private activatedroute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
      this.getAderenciaTemas(params.id);
    });
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

  getAderenciaTemas(id: string) {
    forkJoin(
      this.temaService.getTemas(),
      this.aderenciaService.getAderenciaById(id)
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.temas = data[0];
      const allTemas = {
        idTema: Number(this.ID_TEMA_ADERENCIA_GERAL),
        tema: 'Geral',
        slug: 'geral'
      };
      this.temas.push(allTemas);
      this.temaSelecionado = this.ID_TEMA_ADERENCIA_GERAL;

      this.aderencia = data[1];
      this.filtraAderenciaPorTema(this.temaSelecionado);

    },
      error => console.log(error)
    );
  }

  filtraAderenciaPorTema(tema) {
    const idTema = Number(tema);

    this.aderenciaPartido = this.aderencia.parlamentarAderencia.filter(ad =>
      ad.partido.sigla === this.aderencia.parlamentarPartido.sigla && ad.aderenciaTema.idTema === idTema)[0];

    if (this.aderenciaPartido !== undefined) {
      const total = this.aderenciaPartido.seguiu + this.aderenciaPartido.naoSeguiu +
        this.aderenciaPartido.partidoLiberou + this.aderenciaPartido.faltou;
      this.passo = 100 / total;
    } else {
      this.passo = 0;
    }

    // Aderência ao governo
    this.aderenciaGoverno = this.aderencia.parlamentarAderencia.filter(ad =>
      ad.partido.idPartido === this.ID_PARTIDO_GOVERNO && ad.aderenciaTema.idTema === idTema)[0];

    if (this.aderenciaGoverno !== undefined) {
      const total = this.aderenciaGoverno.seguiu + this.aderenciaGoverno.naoSeguiu +
        this.aderenciaGoverno.partidoLiberou + this.aderenciaGoverno.faltou;
      this.passoGoverno = 100 / total;
    } else {
      this.passoGoverno = 0;
    }
}

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
