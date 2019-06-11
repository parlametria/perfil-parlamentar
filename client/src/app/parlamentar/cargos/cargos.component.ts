import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';

import { ParlamentarComissoes } from 'src/app/shared/models/parlamentarComissoes.model';
import { ComposicaoComissao } from 'src/app/shared/models/composicaoComissao.model';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})
export class CargosComponent implements OnInit, OnDestroy {
  readonly SUPLENTE = 'Suplente';

  private unsubscribe = new Subject();

  parlamentar: ParlamentarComissoes;
  comissoesByCargoTitular: {};
  comissoesByCargoSuplente: {};

  constructor(
    private activatedroute: ActivatedRoute,
    private parlamentarService: ParlamentarService,
  ) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
    });
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getComissoesByid(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentar = parlamentar;
          this.agrupaComissoesPorCargo(parlamentar.parlamentarComissoes);
        },
        error => {
          console.log(error);
        }
      );
  }

  agrupaComissoesPorCargo(comissoes: ComposicaoComissao[]) {
    const suplentes = comissoes.filter((comissao) => comissao.cargo === this.SUPLENTE);
    this.comissoesByCargoTitular = this.comissoesToDict(
      comissoes.filter((comissao) => comissao.cargo !== this.SUPLENTE)
    );
    this.comissoesByCargoSuplente = this.comissoesToDict(suplentes);
  }

  comissoesToDict(comissoes: ComposicaoComissao[]) {
    const comissoesByCargo = {};

    comissoes.forEach((comissao) => {
      const cargo = comissao.cargo;
      if (comissoesByCargo[cargo] !== undefined) {
        comissoesByCargo[cargo] = comissoesByCargo[cargo].concat(comissao);
      } else {
        comissoesByCargo[cargo] = [].concat(comissao);
      }
      return comissoesByCargo;
    });

    return(comissoesByCargo);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
