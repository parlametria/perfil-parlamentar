import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PerguntaService } from '../../../shared/services/pergunta.service';
import { TemaService } from '../../../shared/services/tema.service';
import { Tema } from '../../../shared/models/tema.model';
import { Proposicao } from '../../../shared/models/proposicao.model';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-perguntas-container',
  templateUrl: './perguntas-container.component.html',
  styleUrls: ['./perguntas-container.component.scss']
})
export class PerguntasContainerComponent implements OnInit, OnDestroy {

  readonly FAVOR = 1;
  readonly NAOSEI = -2;
  readonly CONTRA = -1;
  
  private unsubscribe = new Subject();

  temaSelecionado: string;

  listaTemas: Tema[];
  listaProposicoes: Proposicao[];

  perguntasTemaSelecionado: Proposicao[];
  perguntaSelecionada: Proposicao;

  respostasUser: any;

  @Input() receivedTemas: number[];

  constructor(
    private perguntaService: PerguntaService,
    private temaService: TemaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getTemas();
    this.getProposicoes();
    this.getRespostas();

  }

  getTemas() {
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe(
      temas => {
        if (this.receivedTemas) {
          this.listaTemas = temas;
          this.listaTemas.sort((a, b) => {
            let A = Number(a['id']), B = Number(b['id']);

            if (this.receivedTemas.indexOf(A) > this.receivedTemas.indexOf(B)) {
              return 1;
            } else {
              return -1;
            }

          });
          this.temaSelecionado = this.listaTemas[0].id;

        } else {
          this.listaTemas = temas;
          this.temaSelecionado = '3';
        }
      },
      error => console.log(error)
    );
  }

  getProposicoes() {
    this.perguntaService.getProposicoes().pipe(takeUntil(this.unsubscribe)).subscribe(
      proposicoes => {
        this.listaProposicoes = proposicoes;
        this.perguntasTemaSelecionado = this.listaProposicoes.filter((proposicao) => proposicao.tema_id === Number(this.temaSelecionado));
        this.perguntaSelecionada = this.perguntasTemaSelecionado[0];
      },
      error => console.log(error)
    );
  }

  getRespostas() {
    this.userService.getRespostas().pipe(takeUntil(this.unsubscribe)).subscribe(
      res => {
        this.respostasUser = res;
      },
      error => console.log(error)
    );
  }

  setResposta(resposta) {
    let novaResposta = {
      id_votacao: this.perguntaSelecionada.id_votacao,
      resposta: resposta
    }

    this.userService.setResposta(novaResposta);
  }

  onTemaChange() {
    this.perguntasTemaSelecionado = this.listaProposicoes.filter((proposicao) => {
      return proposicao.tema_id === Number(this.temaSelecionado);
    });

    this.perguntaSelecionada = this.perguntasTemaSelecionado[0];
  }

  escolhePergunta(idVotacao) {
    this.perguntaSelecionada = this.perguntasTemaSelecionado.filter((pergunta) => {
      return pergunta.id_votacao === idVotacao
    })[0];
  }

  respondeuPergunta(idVotacao) {    
    return this.respostasUser.votacoes[idVotacao] === this.FAVOR ||
      this.respostasUser.votacoes[idVotacao] === this.CONTRA ||
      this.respostasUser.votacoes[idVotacao] === this.NAOSEI
  }

  respostaPositiva() {
    return this.respostasUser.votacoes[this.perguntaSelecionada.id_votacao] === 1;
  }

  respostaNegativa() {
    return this.respostasUser.votacoes[this.perguntaSelecionada.id_votacao] === -1;
  }

  respostaNeutra() {
    return this.respostasUser.votacoes[this.perguntaSelecionada.id_votacao] === -2;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
