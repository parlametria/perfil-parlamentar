import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  readonly KEY_RIGHT = 'ArrowRight';
  readonly KEY_LEFT = 'ArrowLeft';
  readonly KEY_1 = 'KeyA';
  readonly KEY_2 = 'KeyS';
  readonly KEY_3 = 'KeyD';

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

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === this.KEY_RIGHT) {
      this.proximaPergunta();
    }
    if (event.code === this.KEY_LEFT) {
      this.perguntaAnterior();
    }
    if (event.code === this.KEY_1) {
      this.setResposta(this.FAVOR);
    }
    if (event.code === this.KEY_2) {
      this.setResposta(this.NAOSEI);
    }
    if (event.code === this.KEY_3) {
      this.setResposta(this.CONTRA);
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private perguntaService: PerguntaService,
    private temaService: TemaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.initializeParamMapId();
    this.initializeQuestionario();
    this.getRespostas();
    this.salvandoResposta = false;
  }

  private initializeQuestionario() {
    forkJoin(
      this.temaService.getTemas(),
      this.perguntaService.getProposicoes()
    ).pipe(takeUntil(this.unsubscribe)).subscribe(data => {
      const temas = data[0];
      const proposicoes = data[1];

      if (this.receivedTemas) {
        this.listaTemas = this.sortObjectUsingArray(
          temas,
          this.receivedTemas,
          'idTema'
        );

        this.temaSelecionado = this.listaTemas[0].idTema;
      } else {
        this.listaTemas = temas;
        this.temaSelecionado = 3;
      }

      if (this.proposicaoFromUrl) {
        this.temaSelecionado = this.proposicaoFromUrl.temas[0].idTema;
      }
      this.initializePerguntas(proposicoes);
    },
      error => console.log(error)
    );
  }

  private initializePerguntas(proposicoes) {
    this.listaProposicoes = this.sortProposicoes(proposicoes);

    // Filtra as perguntas do tema selecionado
    this.perguntasTemaSelecionado = this.listaProposicoes.filter(
      proposicao => proposicao.temas[0].idTema === Number(this.temaSelecionado)
    );

    this.todasProposicoesOrdenadas = this.sortProposicoesUsingArray(
      this.listaProposicoes,
      this.receivedTemas
    );

    // Checa se a pergunta é específica da URL ou a primeira do tema selecionado
    if (this.proposicaoFromUrl) {
      this.setPerguntaSelecionadaAndRedirect(this.proposicaoFromUrl);
    } else {
      this.setPerguntaSelecionadaAndRedirect(this.perguntasTemaSelecionado[0]);
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
      idVotacao: this.perguntaSelecionada.proposicaoVotacoes[0].idVotacao,
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

  setTema(tema: Tema) {
    this.temaSelecionado = tema.idTema;
    this.onTemaChange();
  }

  onTemaChange() {
    this.filterPerguntasPorTemaSelecionado();
    this.setPerguntaSelecionadaAndRedirect(this.perguntasTemaSelecionado[0]);
  }

  escolhePergunta(idProposicao) {
    this.setPerguntaSelecionadaAndRedirect(this.perguntasTemaSelecionado.filter(
      pergunta => {
        return pergunta.idProposicao === idProposicao;
      }
    )[0]);
  }

  proximaPergunta() {
    const index = this.todasProposicoesOrdenadas.findIndex(prop =>
      prop.idProposicao === this.perguntaSelecionada.idProposicao
    );

    if (index === this.todasProposicoesOrdenadas.length - 1) {
      // Usuário finalizou questionário
      this.router.navigate(['alinhamento']);
    } else {
      // Passa para próxima pergunta
      const proximaPergunta = this.todasProposicoesOrdenadas[index + 1];
      // Checa se a próxima pergunta é do mesmo tema ou não
      if (proximaPergunta.temas[0].idTema !== this.perguntaSelecionada.temas[0].idTema) {
        this.temaSelecionado = proximaPergunta.temas[0].idTema;
        this.onTemaChange();
      } else {
        this.escolhePergunta(proximaPergunta.idProposicao);
      }
    }
  }

  perguntaAnterior() {
    const index = this.todasProposicoesOrdenadas.findIndex(prop =>
      prop.idProposicao === this.perguntaSelecionada.idProposicao
    );

    if (index !== 0) {
      // Passa para pergunta anterior
      const perguntaAnterior = this.todasProposicoesOrdenadas[index - 1];
      // Checa se a próxima pergunta é do mesmo tema ou não
      if (perguntaAnterior.temas[0].idTema !== this.perguntaSelecionada.temas[0].idTema) {
        this.temaSelecionado = perguntaAnterior.temas[0].idTema;
        this.onTemaChange();
      }
      this.escolhePergunta(perguntaAnterior.idProposicao);
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
    if (this.respostasUser.votacoes && this.perguntaSelecionada.proposicaoVotacoes.length > 0) {
      return (
        this.respostasUser.votacoes[this.perguntaSelecionada.proposicaoVotacoes[0].idVotacao] ===
        this.FAVOR
      );
    }
  }

  respostaNegativa() {
    if (this.respostasUser.votacoes && this.perguntaSelecionada.proposicaoVotacoes.length > 0) {
      return (
        this.respostasUser.votacoes[this.perguntaSelecionada.proposicaoVotacoes[0].idVotacao] ===
        this.CONTRA
      );
    }
  }

  respostaNeutra() {
    if (this.respostasUser.votacoes && this.perguntaSelecionada.proposicaoVotacoes.length > 0) {
      return (
        this.respostasUser.votacoes[this.perguntaSelecionada.proposicaoVotacoes[0].idVotacao] ===
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
      if (a.idProposicao > b.idProposicao) {
        return 1;
      } else if (a.idProposicao < b.idProposicao) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  sortProposicoesUsingArray(proposicoes: Proposicao[], arrayTemas) {
    const proposicoesOrdered = proposicoes.sort((a, b) => {
      const A = Number(a.temas[0].idTema);
      const B = Number(b.temas[0].idTema);

      /* tslint:disable */
      if (arrayTemas.indexOf(A) > arrayTemas.indexOf(B)) return 1;
      else if (arrayTemas.indexOf(A) < arrayTemas.indexOf(B)) return -1;
      else if (a.idProposicao > b.idProposicao) return 1;
      else if (a.idProposicao < b.idProposicao) return -1;
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

  redirectToURLWithID(idVotacao) {
    const firstPerguntaURL = 'questionario/' + idVotacao;
    this.router.navigate([firstPerguntaURL]);
  }

  initializeParamMapId() {
    this.activatedRoute.paramMap.subscribe(
      (params: ParamMap) => {
        this.idProposicaoFromUrl = params.get('id');
        if (this.idProposicaoFromUrl) {
          this.setProposicao(this.idProposicaoFromUrl);
        }
      }
    );
  }

  setProposicao(id: string) {
    this.perguntaService.getProposicao(id)
      .pipe(takeUntil(this.unsubscribe)).subscribe(data => {
        this.proposicaoFromUrl = data;
        this.perguntaSelecionada = this.proposicaoFromUrl;
        this.temaSelecionado = this.perguntaSelecionada.temas[0].idTema;
        if (this.listaProposicoes) {
          this.filterPerguntasPorTemaSelecionado();
        }
      },
        () => {
          this.proposicaoFromUrl = null;
        }
      );
  }

  private filterPerguntasPorTemaSelecionado() {
    this.perguntasTemaSelecionado = this.listaProposicoes.filter(proposicao => {
      return proposicao.temas[0].idTema === Number(this.temaSelecionado);
    });
  }

  private setPerguntaSelecionadaAndRedirect(pergunta) {
    this.perguntaSelecionada = pergunta;
    this.redirectToURLWithID(this.perguntaSelecionada.idProposicao);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Exibir atalhos de teclado' });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
