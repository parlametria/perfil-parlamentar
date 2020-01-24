import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Tema } from 'src/app/shared/models/tema.model';
import { ParlamentarVotos } from 'src/app/shared/models/parlamentarVotos.model';
import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { TemaService } from 'src/app/shared/services/tema.service';
import { OrientacaoService } from 'src/app/shared/services/orientacao.service';
import { Orientacao } from 'src/app/shared/models/orientacao.model';
import { AderenciaService } from 'src/app/shared/services/aderencia.service';
import { Aderencia } from 'src/app/shared/models/aderencia.model';
import { CasaService } from 'src/app/shared/services/casa.service';
import { VotacaoService } from 'src/app/shared/services/votacao.service';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit, OnDestroy {

  readonly FAVOR = 1;
  readonly CONTRA = -1;
  readonly ID_PADRAO_TEMA_TODOS = '99';
  readonly ID_PARTIDO_GOVERNO = 0;

  private unsubscribe = new Subject();

  parlamentar: ParlamentarVotos;
  temas: Tema[];
  proposicoes: Proposicao[];
  orientacao: Orientacao;
  aderencia: Aderencia;
  temaSelecionado: string;
  proposicoesFiltradas: Proposicao[];
  aderenciaFiltrada: any;
  passoGoverno: number;
  quantidadeVotacoesPorTema: any;

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private orientacaoService: OrientacaoService,
    private aderenciaService: AderenciaService,
    private casaService: CasaService,
    private votacaoService: VotacaoService) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {

      const casa = this.casaService.getCasaFromId(params.id);

      this.getParlamentarById(params.id);
      this.initializeProposicoes(params.tema, params.id, casa);
      this.getOrientacoes();
    });
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getVotosbyId(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        parlamentar => {
          this.parlamentar = parlamentar;
        },
        error => {
          console.log(error);
        }
      );
  }

  initializeProposicoes(temaSlug: string, id: string, casa: string) {
    forkJoin(
      this.temaService.getTemas(),
      this.orientacaoService.getProposicoesOrientacao(casa),
      this.aderenciaService.getAderenciaById(id),
      this.votacaoService.getCountVotacoesPorTema(casa)
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      const temas = data[0];
      const proposicoes = data[1];
      this.aderencia = data[2];
      this.quantidadeVotacoesPorTema = data[3];

      // Inicia Temas
      this.temas = temas;
      const allTemas = {
        idTema: 99,
        tema: 'Todos os temas',
        slug: 'todos'
      };
      this.temas.push(allTemas);
      this.temaSelecionado = this.temaService.getTemaIdBySlug(this.temas, temaSlug);

      // Inicia Proposições e aderência com base no tema
      this.proposicoes = proposicoes;
      this.filtraProposicoesPorTema(this.temaSelecionado);

      this.activatedroute.queryParams.subscribe(p => {
        this.temaSelecionado = this.temaService.getTemaIdBySlug(this.temas, p.tema);
        this.filtraProposicoesPorTema(this.temaSelecionado);
        this.filtraAderenciaPorTema(this.temaSelecionado);
      });
    },
      error => console.log(error)
    );
  }

  getOrientacoes() {
    this.orientacaoService.getOrientacoesGoverno().pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.orientacao = data;
    });
  }

  filtraProposicoesPorTema(temaId: string) {
    const temaSlug = this.temaService.getTemaSlugById(this.temas, Number(temaId));

    this.router.navigate([], { queryParams: { tema: temaSlug }, replaceUrl: true });

    if (temaId === undefined || temaId === this.ID_PADRAO_TEMA_TODOS) {
      this.proposicoesFiltradas = this.proposicoes;
    } else {
      this.proposicoesFiltradas = this.proposicoes.filter(proposicao => {
        const temas = proposicao.temas.filter(tema => {
          return tema.idTema === Number(this.temaSelecionado);
        });
        return temas.length > 0;
      });
    }
  }

  filtraAderenciaPorTema(tema) {
    const idTema = Number(tema);

    // Aderência ao governo
    this.aderenciaFiltrada = this.aderencia.parlamentarAderencia.filter(ad =>
      ad.partido.idPartido === this.ID_PARTIDO_GOVERNO && ad.aderenciaTema.idTema === idTema)[0];

    if (this.aderenciaFiltrada !== undefined) {
      const total = this.aderenciaFiltrada.seguiu + this.aderenciaFiltrada.naoSeguiu +
        this.aderenciaFiltrada.partidoLiberou + this.aderenciaFiltrada.faltou;
      this.passoGoverno = 100 / total;
    } else {
      this.passoGoverno = 0;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
