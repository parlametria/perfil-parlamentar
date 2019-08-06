import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
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

  comissoesLista: any;
  liderancaLista: any;

  comissoes: {};
  liderancas: {};

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
    forkJoin(
      this.parlamentarService.getComissoesByid(id),
      this.parlamentarService.getLiderancasByid(id)
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      const comissoes = data[0];
      const liderancas = data[1];

      this.comissoesLista = comissoes;
      this.liderancaLista = liderancas;

      this.agrupaComissoes(comissoes.parlamentarComissoes);
      this.agrupaLiderancas(liderancas.parlamentarLiderancas);
    },
      error => {
        console.log(error);
      }
    );
  }

  agrupaComissoes(comissoes: any[]) {
    this.comissoes = this.cargosToDict(comissoes, 'comissao');
  }

  agrupaLiderancas(liderancas: any[]) {
    this.liderancas = this.cargosToDict(liderancas, 'lideranca');
  }

  cargosToDict(cargos: any[], tipo: string) {
    const cargosObject = {};

    cargos.forEach((cargo) => {
      const cargoNome = cargo.cargo;

      const cargoInfo = this.getCargoInfo(cargo, tipo);

      if (cargosObject[cargoNome] !== undefined) {
        cargosObject[cargoNome] = cargosObject[cargoNome].concat(cargoInfo);
      } else {
        cargosObject[cargoNome] = [].concat(cargoInfo);
      }
      return cargosObject;
    });

    return (cargosObject);
  }

  getCargoInfo(cargo: any, tipo: string) {
    if (tipo === 'comissao') {
      return {
        cargo: cargo.cargo,
        nome: cargo.infoComissao.nome,
        sigla: cargo.infoComissao.sigla
      };
    } else if (tipo === 'lideranca') {
      return {
        cargo: cargo.cargo,
        nome: '',
        sigla: cargo.liderancaPartido.sigla
      };
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
