import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { UserService } from '../shared/services/user.service';
import { AlinhamentoService } from '../shared/services/alinhamento.service';
import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-congresso',
  templateUrl: './congresso.component.html',
  styleUrls: ['./congresso.component.scss']
})
export class CongressoComponent implements OnInit, OnDestroy {
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';

  parlamentares: Parlamentar[];
  view: any;
  filter: any;

  private unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    public alinhamentoService: AlinhamentoService
  ) { }

  ngOnInit() {
    this.view = this.VIEW_LG;
    this.getParlamentares();
  }

  getParlamentares() {
    this.userService
      .getRespostas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        respostas => {
          if (!(Object.keys(respostas.votacoes).length === 0 && respostas.votacoes.constructor === Object)) {
            this.alinhamentoService
              .get(respostas)
              .pipe(takeUntil(this.unsubscribe))
              .subscribe(
                parlamentares => {
                  this.parlamentares = parlamentares;
                },
                error => console.log(error)
              );
          }
        },
        error => console.log(error)
      );
  }

  getParlamentaresComAlinhamento() {
    const filteredParlamentares = this.parlamentares.filter(parlamentar => parlamentar.alinhamento.perguntasIguais >= 3);

    if (filteredParlamentares !== undefined) {
      return filteredParlamentares.length;
    } else {
      return 0;
    }

  }

  setView(view: string) {
    this.view = view;
  }

  search(filter: any) {
    this.filter = filter;
    this.alinhamentoService.search(filter);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
