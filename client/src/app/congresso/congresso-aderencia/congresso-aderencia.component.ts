import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AderenciaService } from 'src/app/shared/services/aderencia.service';

import { ParlamentarAderencia } from 'src/app/shared/models/parlamentarAderencia.model';

@Component({
  selector: 'app-congresso-aderencia',
  templateUrl: './congresso-aderencia.component.html',
  styleUrls: ['./congresso-aderencia.component.scss']
})
export class CongressoAderenciaComponent implements OnInit, OnDestroy {

  readonly VIEW_ARC = 'arc';
  readonly VIEW_BEE = 'bee';
  readonly FILTRO_PADRAO_TEMA = -1;
  readonly ID_TEMA_GERAL = 99;

  parlamentares: ParlamentarAderencia[];
  parlamentaresCompleto: ParlamentarAderencia[];

  filtro: any;
  orientador: string;
  view: any;
  isLoading: boolean;


  private unsubscribe = new Subject();

  constructor(
    private aderenciaService: AderenciaService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit() {
    this.isLoading = true;
    this.view = this.VIEW_ARC;
    this.orientador = 'Governo';
    this.getParlamentares();
    this.getAderencia();
  }

  getParlamentares() {
    this.aderenciaService
    .getAderencia()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      parlamentares => {
        this.parlamentares = parlamentares;
      },
      error => console.log(error)
    );
  }

  getAderencia() {
    this.aderenciaService
    .getAderenciaAsObservable()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      parlamentares => {
        let idTema = this.filtro.tema;

        if (this.filtro.tema === this.FILTRO_PADRAO_TEMA) {
          idTema = this.ID_TEMA_GERAL;
        }

        this.parlamentaresCompleto = parlamentares.sort((a, b) => {
          return this.aderenciaService.sort(a, b, idTema);
        });

        console.log('parlamentares', this.parlamentaresCompleto);
      }
    );
  }

  search(filter: any) {
    this.filtro = filter;
    this.filtro.orientador = this.orientador;
    this.aderenciaService.search(filter);
  }

  setView(view: string) {
    this.view = view;
    this.cdr.detectChanges();
  }

  setChartVisibility(isFinished: boolean) {
    this.isLoading = !isFinished;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
