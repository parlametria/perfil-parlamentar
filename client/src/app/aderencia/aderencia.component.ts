import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AderenciaService } from 'src/app/shared/services/aderencia.service';
import { ParlamentarAderencia } from 'src/app/shared/models/parlamentarAderencia.model';
import { CasaService } from 'src/app/shared/services/casa.service';

@Component({
  selector: 'app-aderencia',
  templateUrl: './aderencia.component.html',
  styleUrls: ['./aderencia.component.scss']
})
export class AderenciaComponent implements OnInit, OnDestroy {

  readonly VIEW_ARC = 'arc';
  readonly VIEW_BEE = 'bee';
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';
  readonly FILTRO_PADRAO_TEMA = -1;
  readonly ID_TEMA_GERAL = 99;

  parlamentares: ParlamentarAderencia[];
  parlamentaresCompleto: ParlamentarAderencia[];
  parlamentaresCasa: ParlamentarAderencia[];

  filtro: any;
  orientador: string;
  casa: string;
  view: any;
  orderBy: string;
  isLoading: boolean;

  private unsubscribe = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private aderenciaService: AderenciaService,
    private casaService: CasaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.updateViewViaUrl();

    this.orientador = 'Governo';
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.casaService.set(params.get('casa'));
        this.casa = params.get('casa');
        this.getParlamentaresPorCasa();
      });
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

          this.getParlamentaresPorCasa();
        }
      );
  }

  getParlamentaresPorCasa(): void {
    if (this.parlamentaresCompleto !== undefined && this.parlamentaresCompleto) {
      this.parlamentaresCasa = this.parlamentaresCompleto.filter(p => {
        return (p.casa === this.casa);
      });
    }
  }

  search(filter: any) {
    this.filtro = filter;
    this.filtro.orientador = this.orientador;
    this.aderenciaService.search(filter, 'DESC');
  }

  getVisaoPlenario() {
    return (this.view === 'arc' || this.view === 'bee');
  }

  setView(view: string) {
    this.view = view;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.view = view;

    this.router.navigate([], {  relativeTo: this.activatedRoute, queryParams });

    this.cdr.detectChanges();
  }

  setChartVisibility(isFinished: boolean) {
    this.isLoading = !isFinished;
  }

  setOrderBy(orderBy: string) {
    this.orderBy = orderBy;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.orderBy = orderBy;

    this.router.navigate([], {  relativeTo: this.activatedRoute, queryParams });

    this.cdr.detectChanges();
  }

  toggleOrderBy() {
    if (this.orderBy === 'DESC') {
      this.setOrderBy('ASC');
    } else {
      this.setOrderBy('DESC');
    }
  }

  updateViewViaUrl() {
    this.activatedRoute.queryParams.subscribe(
      param => {
        if (param.view !== undefined) {
          this.view = param.view;
        } else {
          this.view = this.VIEW_ARC;
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
