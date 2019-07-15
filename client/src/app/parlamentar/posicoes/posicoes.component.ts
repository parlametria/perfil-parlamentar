import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarService } from 'src/app/shared/services/parlamentar.service';
import { TemaService } from 'src/app/shared/services/tema.service';
import { PerguntaService } from 'src/app/shared/services/pergunta.service';
import { UserService } from 'src/app/shared/services/user.service';

import { ParlamentarPosicao } from 'src/app/shared/models/parlamentarPosicao.model';
import { Tema } from 'src/app/shared/models/tema.model';
import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { Resposta } from 'src/app/shared/models/resposta.model';

@Component({
  selector: 'app-posicoes',
  templateUrl: './posicoes.component.html',
  styleUrls: ['./posicoes.component.scss']
})
export class PosicoesComponent implements OnInit, OnDestroy {
  readonly FAVOR = 1;
  readonly CONTRA = -1;
  readonly ID_PADRAO_TEMA_TODOS = '99';

  private unsubscribe = new Subject();

  parlamentar: ParlamentarPosicao;
  temas: Tema[];
  proposicoes: Proposicao[];
  respostas: Resposta;
  temaSelecionado: string;
  proposicoesFiltradas: Proposicao[];

  constructor(
    private activatedroute: ActivatedRoute,
    private router: Router,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private perguntaService: PerguntaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.activatedroute.parent.params.pipe(take(1)).subscribe(params => {
      this.getParlamentarById(params.id);
      this.initializeProposicoes(params.tema);
      this.getRespostas();
    });
  }

  getParlamentarById(id: string) {
    this.parlamentarService
      .getPosicoesById(id)
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
        idTema: 99,
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
        return proposicao.temas[0].idTema === Number(this.temaSelecionado);
      });

    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
