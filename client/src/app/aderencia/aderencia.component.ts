import { Component, OnInit, OnDestroy } from '@angular/core';

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

  parlamentares: ParlamentarAderencia[];

  private unsubscribe = new Subject();

  filtro: any;
  orientador: string;

  constructor(private aderenciaService: AderenciaService) { }

  ngOnInit() {
    this.getParlamentares();
    this.orientador = 'Governo';
  }

  getParlamentares() {
    this.aderenciaService
      .getAderencia()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentares => {
          this.parlamentares = parlamentares;
          console.log(this.parlamentares);
        },
        error => console.log(error)
      );
  }

  search(filtro: any) {
    this.filtro = filtro;
    this.filtro.orientador = this.orientador;
    this.aderenciaService.search(this.filtro);
  }

  setOrientador(orientador: string) {
    console.log('orientador', orientador);
    this.orientador = orientador;
    this.search(this.filtro);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
