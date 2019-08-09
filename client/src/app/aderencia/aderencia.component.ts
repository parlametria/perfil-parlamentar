import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AderenciaService } from '../shared/services/aderencia.service';

import { ParlamentarAderencia } from '../shared/models/parlamentarAderencia.model';

@Component({
  selector: 'app-aderencia',
  templateUrl: './aderencia.component.html',
  styleUrls: ['./aderencia.component.scss']
})
export class AderenciaComponent implements OnInit, OnDestroy {
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';

  parlamentares: ParlamentarAderencia[];

  private unsubscribe = new Subject();

  p = 1;
  view: string;
  isLoading: boolean;
  filtro: any;
  orderBy: string;
  orientador: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private aderenciaService: AderenciaService,
    private router: Router) { }

  ngOnInit() {
    this.view = this.VIEW_LG;
    this.getParlamentares();
    this.orderBy = 'DESC';
    this.orientador = 'Governo';
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

  search(filtro: any) {
    this.filtro = filtro;
    this.filtro.orientador = this.orientador;
    this.aderenciaService.search(this.filtro, this.orderBy);
  }

  setOrientador(orientador: string) {
    this.orientador = orientador;
    this.search(this.filtro);
  }

  pageChange(p: number) {
    this.p = p;

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.page = p;
    this.router.navigate([], { queryParams });
  }

  getParlamentarPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index + 1;
  }

  setView(view: string) {
    this.view = view;

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.view = view;
    this.router.navigate([], { queryParams });
  }

  setOrderBy(orderBy: string) {
    this.orderBy = orderBy;

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.orderBy = orderBy;
    this.router.navigate([], { queryParams });
  }

  toggleOrderBy() {
    if (this.orderBy === 'DESC') {
      this.setOrderBy('ASC');
    } else {
      this.setOrderBy('DESC');
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
