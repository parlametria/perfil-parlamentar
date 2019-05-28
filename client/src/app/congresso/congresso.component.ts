import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, mergeMap, debounceTime } from 'rxjs/operators';

import { UserService } from '../shared/services/user.service';
import { AlinhamentoService } from '../shared/services/alinhamento.service';
import { Parlamentar } from 'src/app/shared/models/parlamentar.model';

@Component({
  selector: 'app-congresso',
  templateUrl: './congresso.component.html',
  styleUrls: ['./congresso.component.scss']
})
export class CongressoComponent implements OnInit, OnDestroy {
  readonly VIEW_ARC = 'arc';
  readonly VIEW_BEE = 'bee';

  parlamentares: Parlamentar[];
  parlamentaresCompleto: Parlamentar[];
  view: any;
  filter: any;

  private unsubscribe = new Subject();

  constructor(
    private userService: UserService,
    public alinhamentoService: AlinhamentoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.view = this.VIEW_ARC;
    this.getParlamentares();
    this.getAlinhamento();
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

  getAlinhamento() {
    this.userService.getRespostas()
      .pipe(
        takeUntil(this.unsubscribe),
        debounceTime(400),
        mergeMap(respostas => {
          return this.alinhamentoService.getAlinhamento(respostas);
        }))
      .subscribe(parlamentares => {
        this.parlamentaresCompleto = parlamentares;
      });

  }

  getParlamentaresComAlinhamento() {
    if (this.parlamentares !== undefined && this.parlamentares.length > 0) {
      const temaIndex = this.parlamentares[0].alinhamento.temas.findIndex(res => res.tema_id === this.filter.tema);

      let filteredParlamentares;
      if (temaIndex !== undefined && temaIndex !== -1) {
        filteredParlamentares = this.parlamentares.filter(parlamentar =>
          parlamentar.alinhamento.temas[temaIndex].perguntasIguais >= 3
        );

      } else {
        filteredParlamentares = this.parlamentares.filter(parlamentar =>
          parlamentar.alinhamento.perguntasIguais >= 3
        );
      }

      if (filteredParlamentares !== undefined) {
        return filteredParlamentares.length;
      } else {
        return 0;
      }

    } else {
      return 0;
    }
  }

  setView(view: string) {
    this.view = view;
    this.cdr.detectChanges();
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
