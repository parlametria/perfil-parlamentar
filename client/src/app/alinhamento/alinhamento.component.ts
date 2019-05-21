import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from 'src/app/shared/services/user.service';
import { AlinhamentoService } from 'src/app/shared/services/alinhamento.service';
import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-alinhamento',
  templateUrl: './alinhamento.component.html',
  styleUrls: ['./alinhamento.component.scss']
})
export class AlinhamentoComponent implements OnInit, OnDestroy {
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';

  parlamentares: Parlamentar[];
  p = 1;
  view: string;
  isLoading: boolean;

  filtro: any;

  private unsubscribe = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) { }

  ngOnInit() {
    this.view = this.VIEW_MD;
    this.isLoading = true;
    this.getParlamentares();
    this.updateRankingViaUrl();
  }

  getParlamentares() {
    this.userService
      .getRespostas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        respostas => {
          this.alinhamentoService
            .get(respostas)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe(
              parlamentares => {
                this.parlamentares = parlamentares;
                this.eventScroll();
                if (this.parlamentares.length > 0) {
                  this.isLoading = false;
                }
              },
              error => console.log(error)
            );
        },
        error => console.log(error)
      );
  }

  search(filtro: any) {
    this.filtro = filtro;
    this.alinhamentoService.search(filtro);
  }

  onFollow(following: boolean) {
    console.log(following);
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

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private updateRankingViaUrl() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        Object.keys(params).forEach(value => {
          if (value === 'page') {
            this.p = params[value];
          }
          if (value === 'view') {
            if (params[value] === this.VIEW_SM ||
              params[value] === this.VIEW_MD ||
              params[value] === this.VIEW_LG) {
              this.view = params[value];
            }
          }
        });
      }
    );
  }

  // Evento para carregar a foto dos primeiros parlamentares da lista
  private eventScroll() {
    window.scrollTo(window.scrollX, window.scrollY - 1);
    window.scrollTo(window.scrollX, window.scrollY + 1);
  }
}
