import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ParlamentarAderencia } from '../shared/models/parlamentarAderencia.model';
import { BuscaParlamentarService } from '../shared/services/busca-parlamentar.service';
import { CasaService } from '../shared/services/casa.service';

@Component({
  selector: 'app-busca-parlamentar',
  templateUrl: './busca-parlamentar.component.html',
  styleUrls: ['./busca-parlamentar.component.scss']
})
export class BuscaParlamentarComponent implements OnInit, OnDestroy {

  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';

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
    private buscaParlamentarServive: BuscaParlamentarService,
    private casaService: CasaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.updateParamsViaUrl();

    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.casaService.set(params.get('casa'));
        this.casa = params.get('casa');
        this.getParlamentaresPorCasa();
      });
    this.getParlamentares();
  }

  getParlamentares() {
    this.buscaParlamentarServive
      .getParlamentares()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentares => {
          this.parlamentares = parlamentares;
        },
        error => console.log(error)
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
    this.filtro = JSON.parse(JSON.stringify(filter));
    this.filtro.orderBy = this.orderBy;

    this.buscaParlamentarServive.search(this.filtro, this.orderBy);
  }

  toggleOrderBy() {
    if (this.orderBy === 'ASC') {
      this.setOrderBy('DESC');
    } else {
      this.setOrderBy('ASC');
    }
  }

  setOrderBy(orderBy: string) {
    this.orderBy = orderBy;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.orderBy = orderBy;

    this.router.navigate([], {  relativeTo: this.activatedRoute, queryParams });

    this.cdr.detectChanges();

    this.search(this.filtro);
  }

  setView(view: string) {
    this.view = view;
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.view = view;

    this.router.navigate([], {  relativeTo: this.activatedRoute, queryParams });

    this.cdr.detectChanges();
  }

  updateParamsViaUrl() {
    this.activatedRoute.queryParams.subscribe(
      param => {
        if (param.view !== undefined) {
          this.view = param.view;
        } else {
          this.view = this.VIEW_MD;
        }
        if (param.orderBy !== undefined) {
          this.setOrderBy(param.orderBy);
        } else {
          this.orderBy = 'ASC';
        }
      }
    );
  }

  isActive(casa: string) {
    return this.router.url.split(/\/|\?/)[2] === casa;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
