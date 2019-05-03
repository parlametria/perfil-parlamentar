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

@Component({
  selector: 'app-parlamentar',
  templateUrl: './parlamentar.component.html',
  styleUrls: ['./parlamentar.component.scss']
})
export class ParlamentarComponent implements OnInit, OnDestroy {
  readonly FAVOR = 1;
  readonly CONTRA = -1;
  readonly ID_PADRAO_TEMA_TODOS = '7';

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;
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
          console.log(this.parlamentar);
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

    this.router.navigate([], { queryParams: { tema: temaSlug } });

    if (temaId === undefined || temaId === this.ID_PADRAO_TEMA_TODOS) {
      this.proposicoesFiltradas = this.proposicoes;
    } else {
      this.proposicoesFiltradas = this.proposicoes.filter(proposicao => {
        return proposicao.tema_id === Number(this.temaSelecionado);
      });

    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
