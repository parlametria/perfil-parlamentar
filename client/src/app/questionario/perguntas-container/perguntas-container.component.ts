import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PerguntaService } from '../../shared/services/pergunta.service';
import { TemaService } from '../../shared/services/tema.service';
import { Tema } from '../../shared/models/tema.model';
import { Proposicao } from '../../shared/models/proposicao.model';
import { UserService } from '../../shared/services/user.service';
import { Resposta } from '../../shared/models/resposta.model';

@Component({
  selector: 'app-perguntas-container',
  templateUrl: './perguntas-container.component.html',
  styleUrls: ['./perguntas-container.component.scss']
})
export class PerguntasContainerComponent implements OnInit, OnDestroy {
  readonly FAVOR = 1;
  readonly NAOSEI = -2;
  readonly CONTRA = -1;
  readonly MIN_RESPOSTAS = 3;

  private unsubscribe = new Subject();

  temaSelecionado: number;
  idProposicaoFromUrl: string;
  proposicaoFromUrl: Proposicao;

  listaTemas: Tema[];
  listaProposicoes: Proposicao[];
  todasProposicoesOrdenadas: Proposicao[];

  perguntasTemaSelecionado: Proposicao[];
  perguntaSelecionada: Proposicao;

  respostasUser: Resposta;

  salvandoResposta: boolean;

  @Input() receivedTemas: number[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private perguntaService: PerguntaService,
    private temaService: TemaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.idProposicaoFromUrl = this.route.snapshot.paramMap.get('id');
    this.initializeQuestionario();
    this.getRespostas();
    this.salvandoResposta = false;
  }

  initializeQuestionario() {
    if (this.idProposicaoFromUrl !== null) {
      this.initializeQuestionarioWithPergunta(this.idProposicaoFromUrl);
    } else {
      this.initializeQuestionarioWithoutPergunta();
    }
  }

  private initializeQuestionarioWithoutPergunta() {
    this.perguntaService.getProposicoes()
    .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      this.redirectToURLWithID(data[0].id_votacao);
    },
      error => console.log(error)
    );
  }

  private initializeQuestionarioWithPergunta(id: string) {
    forkJoin(
      this.temaService.getTemas(),
      this.perguntaService.getProposicoes(),
      this.perguntaService.getProposicao(id)
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      const temas = data[0];
      const proposicoes = data[1];
      const proposicao = data[2];

      if (this.receivedTemas) {
        this.listaTemas = this.sortObjectUsingArray(
          temas,
          this.receivedTemas,
          'id'
        );

        this.temaSelecionado = this.listaTemas[0].id;
      } else {
        this.listaTemas = temas;
        this.temaSelecionado = 3;
      }
      this.temaSelecionado = proposicao.tema_id;

      this.initializePerguntas(proposicoes);
    },
      error => console.log(error)
    );
  }

  private initializePerguntas(proposicoes) {
    this.listaProposicoes = this.sortProposicoes(proposicoes);

    // Filtra as perguntas do tema selecionado
    this.perguntasTemaSelecionado = this.listaProposicoes.filter(
      proposicao => proposicao.tema_id === Number(this.temaSelecionado)
    );

    this.todasProposicoesOrdenadas = this.sortProposicoesUsingArray(
      this.listaProposicoes,
      this.receivedTemas
    );

    if (this.idProposicaoFromUrl !== null) {
      this.perguntaSelecionada = this.perguntasTemaSelecionado.filter(
        proposicao => proposicao.id_votacao === Number(this.idProposicaoFromUrl))[0];
    } else {
      this.perguntaSelecionada = this.perguntasTemaSelecionado[0];
    }
  }

  getRespostas() {
    this.userService
      .getRespostas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        res => {
          this.respostasUser = res;
        },
        error => console.log(error)
      );
  }

  setResposta(resposta) {
    const novaResposta = {
      id_votacao: this.perguntaSelecionada.id_votacao,
      resposta
    };

    this.salvandoResposta = true;
    this.userService
      .setResposta(novaResposta)
      .then(() => {
        setTimeout(() => {
          this.salvandoResposta = false;
          this.proximaPergunta();
        }, 1000);
      })
      .catch(() => console.log('Ops! Não foi possível salvar a resposta.'));
  }

  onTemaChange() {
    this.perguntasTemaSelecionado = this.listaProposicoes.filter(proposicao => {
      return proposicao.tema_id === Number(this.temaSelecionado);
    });

    this.perguntaSelecionada = this.perguntasTemaSelecionado[0];
  }

  escolhePergunta(idVotacao) {
    this.perguntaSelecionada = this.perguntasTemaSelecionado.filter(
      pergunta => {
        return pergunta.id_votacao === idVotacao;
      }
    )[0];
  }

  proximaPergunta() {
    const index = this.todasProposicoesOrdenadas.indexOf(
      this.perguntaSelecionada
    );

    if (index === this.todasProposicoesOrdenadas.length - 1) {
      // Usuário finalizou questionário
      this.router.navigate(['alinhamento']);
    } else {
      // Passa para próxima pergunta
      const proximaPergunta = this.todasProposicoesOrdenadas[index + 1];

      // Checa se a próxima pergunta é do mesmo tema ou não
      if (proximaPergunta.tema_id !== this.perguntaSelecionada.tema_id) {
        this.temaSelecionado = proximaPergunta.tema_id;
        this.onTemaChange();
      } else {
        this.escolhePergunta(proximaPergunta.id_votacao);
      }
    }
  }

  respondeuPergunta(idVotacao) {
    if (this.respostasUser.votacoes) {
      return (
        this.respostasUser.votacoes[idVotacao] === this.FAVOR ||
        this.respostasUser.votacoes[idVotacao] === this.CONTRA ||
        this.respostasUser.votacoes[idVotacao] === this.NAOSEI
      );
    }
  }

  respostaPositiva() {
    if (this.respostasUser.votacoes) {
      return (
        this.respostasUser.votacoes[this.perguntaSelecionada.id_votacao] ===
        this.FAVOR
      );
    }
  }

  respostaNegativa() {
    if (this.respostasUser.votacoes) {
      return (
        this.respostasUser.votacoes[this.perguntaSelecionada.id_votacao] ===
        this.CONTRA
      );
    }
  }

  respostaNeutra() {
    if (this.respostasUser.votacoes) {
      return (
        this.respostasUser.votacoes[this.perguntaSelecionada.id_votacao] ===
        this.NAOSEI
      );
    }
  }

  sortObjectUsingArray(object, array, key) {
    const objectOrdered = object.sort((a, b) => {
      const A = Number(a[key]);
      const B = Number(b[key]);

      if (array.indexOf(A) > array.indexOf(B)) {
        return 1;
      } else {
        return -1;
      }

    });

    return objectOrdered;
  }

  sortProposicoes(proposicoes) {
    return proposicoes.sort((a, b) => {
      if (a.id_votacao > b.id_votacao) {
        return 1;
      } else if (a.id_votacao < b.id_votacao) {
          return -1;
      } else {
        return 0;
      }
    });
  }

  sortProposicoesUsingArray(proposicoes: Proposicao[], arrayTemas) {
    const proposicoesOrdered = proposicoes.sort((a, b) => {
      const A = Number(a.tema_id);
      const B = Number(b.tema_id);

      /* tslint:disable */
      if (arrayTemas.indexOf(A) > arrayTemas.indexOf(B)) return 1;
      else if (arrayTemas.indexOf(A) < arrayTemas.indexOf(B)) return -1;
      else if (a.id_votacao > b.id_votacao) return 1;
      else if (a.id_votacao < b.id_votacao) return -1;
      else return 0;
      /* tslint:enable */
    });

    return proposicoesOrdered;
  }

  canVerResultados(): boolean {
    const respostas = Object.keys(this.respostasUser.votacoes).map(
      resposta => this.respostasUser.votacoes[resposta]
    );
    return respostas.filter(r => r !== 0).length >= this.MIN_RESPOSTAS;
  }

  private redirectToURLWithID(idVotacao) {
    const firstPerguntaURL = 'questionario/' + idVotacao;
    this.router.navigate([firstPerguntaURL]);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
