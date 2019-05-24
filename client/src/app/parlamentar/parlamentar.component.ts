import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ParlamentarService } from './../shared/services/parlamentar.service';
import { TemaService } from './../shared/services/tema.service';
import { PerguntaService } from './../shared/services/pergunta.service';
import { UserService } from './../shared/services/user.service';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';
import { Tema } from 'src/app/shared/models/tema.model';
import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { Resposta } from 'src/app/shared/models/resposta.model';
import { ComposicaoComissao } from '../shared/models/composicao_comissao.model';

@Component({
  selector: 'app-parlamentar',
  templateUrl: './parlamentar.component.html',
  styleUrls: ['./parlamentar.component.scss']
})
export class ParlamentarComponent implements OnInit, OnDestroy {
  readonly FAVOR = 1;
  readonly CONTRA = -1;
  readonly ID_PADRAO_TEMA_TODOS = '7';
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

  async ngOnInit() {
    const id = this.activatedroute.snapshot.paramMap.get('id');
    const temaSlug = this.activatedroute.snapshot.queryParamMap.get('tema');

    this.getParlamentarById(id);
    this.initializeProposicoes(temaSlug);
    this.getRespostas();
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

  initializeProposicoes(temaSlug: string) {
    forkJoin(
      this.temaService.getTemas(),
      this.perguntaService.getProposicoes()
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      const temas = data[0];
      const proposicoes = data[1];

      // Inicia Temas
      this.temas = temas;
      const allTemas = {
        id: 7,
        tema: 'Todos os temas',
        slug: 'todos'
      };
      this.temas.push(allTemas);
      this.temaSelecionado = this.temaService.getTemaIdBySlug(this.temas, temaSlug);

      // Inicia Proposições com base no tema
      this.proposicoes = proposicoes;
      this.filtraProposicoesPorTema(this.temaSelecionado);

      this.activatedroute.queryParams.subscribe(p => {
        this.temaSelecionado = this.temaService.getTemaIdBySlug(this.temas, p.tema);
        this.filtraProposicoesPorTema(this.temaSelecionado);
      });

    },
      error => console.log(error)
    );
  }

  getRespostas() {
    this.userService
      .getRespostas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        respostas => {
          this.respostas = respostas;
        },
        error => {
          console.log(error);
        }
      );
  }

  filtraProposicoesPorTema(temaId: string) {
    const temaSlug = this.temaService.getTemaSlugById(this.temas, Number(temaId));

    this.router.navigate([], { queryParams: { tema: temaSlug }, replaceUrl: true });

    if (temaId === undefined || temaId === this.ID_PADRAO_TEMA_TODOS) {
      this.proposicoesFiltradas = this.proposicoes;
    } else {
      this.proposicoesFiltradas = this.proposicoes.filter(proposicao => {
        return proposicao.tema_id === Number(this.temaSelecionado);
      });

    }
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
