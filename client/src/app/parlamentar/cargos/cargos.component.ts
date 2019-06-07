import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { TemaService } from 'src/app/shared/services/tema.service';
import { PerguntaService } from 'src/app/shared/services/pergunta.service';
import { UserService } from 'src/app/shared/services/user.service';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';
import { Tema } from 'src/app/shared/models/tema.model';
import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { Resposta } from 'src/app/shared/models/resposta.model';
import { ComposicaoComissao } from 'src/app/shared/models/composicao_comissao.model';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss']
})
export class CargosComponent implements OnInit, OnDestroy {
  readonly SUPLENTE = 'Suplente';

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;
  temas: Tema[];
  proposicoes: Proposicao[];
  respostas: Resposta;
  temaSelecionado: string;
  proposicoesFiltradas: Proposicao[];
  comissoesByCargoTitular: {};
  comissoesByCargoSuplente: {};

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private perguntaService: PerguntaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.activatedroute.parent.params.subscribe(params => {
      this.getParlamentarById(params.id);
    });
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getVotacoesParlamentarPorId(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentar = parlamentar;
          this.agrupaComissoesPorCargo(parlamentar.comissoes);
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
