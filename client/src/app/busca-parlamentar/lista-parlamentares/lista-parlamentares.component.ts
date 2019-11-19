import { Component, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Subject } from 'rxjs';

import { ParlamentarBuscaParlamentar } from 'src/app/shared/models/parlamentarBuscaParlamentar.model';

@Component({
  selector: 'app-lista-parlamentares',
  templateUrl: './lista-parlamentares.component.html',
  styleUrls: ['./lista-parlamentares.component.scss']
})
export class ListaParlamentaresComponent implements OnDestroy {

  @Input() parlamentares: ParlamentarBuscaParlamentar[];
  @Input() filter: any;

  private unsubscribe = new Subject();

  p = 1;
  isLoading: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

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