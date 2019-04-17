import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;
  temas: Tema[];
  proposicoes: Proposicao[];
  respostas: Resposta;
  temaSelecionado: string;
  proposicoesFiltradas: Proposicao[];

  constructor(
    private route: ActivatedRoute,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private perguntaService: PerguntaService,
    private userService: UserService
  ) { }

  async ngOnInit() {
    const cpf = this.route.snapshot.paramMap.get('cpf');

    this.getParlamentarByCpf(cpf);
    this.getTemas();
    this.getProposicoes();
    //this.initializeProposicoes();
    this.getRespostas();
  }

  getParlamentarByCpf(cpf: string) {
    this.parlamentarService
      .getVotacoesParlamentarPorCpf(cpf)
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

  getTemas() {
    this.temaService
      .getTemas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        temas => {
          this.temas = temas;
          const allTemas = {
            id: 7,
            tema: 'Todos os temas',
            slug: 'todos'
          };
          this.temas.push(allTemas);
          // this.temaSelecionado = this.getUrlParams();
          this.getUrlParams();
          //this.temaSelecionado = '7';
        },
        error => console.log(error)
      );
  }

  getProposicoes() {
    this.perguntaService
      .getProposicoes()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        proposicoes => {
          this.proposicoes = proposicoes;
          this.onTemaChange(this.temaSelecionado);
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

  onTemaChange(temaId) {
    console.log(temaId);
    if (temaId === undefined || temaId === '7') {
      this.proposicoesFiltradas = this.proposicoes;
    } else {
      this.proposicoesFiltradas = this.proposicoes.filter(proposicao => {
        return proposicao.tema_id === Number(this.temaSelecionado);
      });

    }
  }

  getUrlParams() {
    // const temaSlug = this.route.snapshot.queryParamMap.get('tema');

    // const temaId = this.getTemaIdBySlug(temaSlug);

    // console.log(temaId);
    // return temaId;
    this.route.queryParams.subscribe(params => {
      if (params.tema) {
        console.log(params.tema);
        if (params.tema === undefined) {
          this.temaSelecionado = '7';
        } else {
          const temaId = this.getTemaIdBySlug(params.tema);
          console.log(temaId);
          this.temaSelecionado = temaId;
        }

      }
    });
  }

  private getTemaIdBySlug(slug: string): string {
    const tema = this.temas.filter(t => t.slug === slug);

    if (tema.length > 0) {
      return String(tema[0].id);
    } else {
      return '7';
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
