import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PerguntaService } from '../../shared/services/pergunta.service';
import { TemaService } from '../../shared/services/tema.service';
import { Tema } from '../../shared/models/tema.model';
import { Proposicao } from '../../shared/models/proposicao.model';

@Component({
  selector: 'app-perguntas',
  templateUrl: './perguntas-container.component.html',
  styleUrls: ['./perguntas-container.component.scss']
})
export class PerguntasContainerComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  private temaSelecionado: string;

  private listaTemas: Tema[];
  private listaProposicoes: Proposicao[];

  private perguntasTemaSelecionado: Proposicao[];
  private perguntaSelecionada: Proposicao;

  constructor(
    private perguntaService: PerguntaService,
    private temaService: TemaService
  ) {
    // Inicia tema a partir do ID
    this.temaSelecionado = '3';
  }

  ngOnInit() {
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe(
      temas => this.listaTemas = temas,
      error => console.log(error)
    );

    this.perguntaService.getProposicoes().pipe(takeUntil(this.unsubscribe)).subscribe(
      proposicoes => {
        this.listaProposicoes = proposicoes;
        this.perguntasTemaSelecionado = this.listaProposicoes.filter((proposicao) => proposicao.tema_id === Number(this.temaSelecionado));
        this.perguntaSelecionada = this.perguntasTemaSelecionado[0];
      },
      error => console.log(error)
    );
  }

  onTemaChange() {
    this.perguntasTemaSelecionado = this.listaProposicoes.filter((proposicao) => {
      return proposicao.tema_id === Number(this.temaSelecionado);
    });

    this.perguntaSelecionada = this.perguntasTemaSelecionado[0];
  }

  escolhePergunta(pergunta_id) {
    this.perguntaSelecionada = this.perguntasTemaSelecionado.filter((pergunta) => {
      return pergunta.id_votacao === pergunta_id
    })[0];  
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
