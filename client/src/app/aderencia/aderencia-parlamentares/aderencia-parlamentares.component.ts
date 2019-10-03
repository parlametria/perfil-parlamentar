import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AderenciaService } from 'src/app/shared/services/aderencia.service';

import { ParlamentarAderencia } from 'src/app/shared/models/parlamentarAderencia.model';

@Component({
  selector: 'app-aderencia-parlamentares',
  templateUrl: './aderencia-parlamentares.component.html',
  styleUrls: ['./aderencia-parlamentares.component.scss']
})
export class AderenciaParlamentaresComponent implements OnInit, OnDestroy {
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';

  @Input() parlamentares: ParlamentarAderencia[];
  @Input() view: string;
  @Input() orderBy: string;

  private unsubscribe = new Subject();

  p = 1;
  isLoading: boolean;
  filtro: any;
  orientador: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private aderenciaService: AderenciaService,
    private router: Router) { }

  ngOnInit() {
    this.view = this.VIEW_LG;
    this.orderBy = 'DESC';
    this.orientador = 'Governo';
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
