import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, mergeMap, debounceTime } from 'rxjs/operators';

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
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) {}

  ngOnInit() {
    this.view = this.VIEW_LG;
    this.isLoading = true;
    this.getParlamentares();
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
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // Evento para carregar a foto dos primeiros parlamentares da lista
  private eventScroll() {
    window.scrollTo(window.scrollX, window.scrollY - 1);
    window.scrollTo(window.scrollX, window.scrollY + 1);
  }
}
