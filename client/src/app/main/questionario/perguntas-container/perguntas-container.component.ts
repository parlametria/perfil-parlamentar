import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PerguntaService } from '../../../shared/services/pergunta.service';
import { TemaService } from '../../../shared/services/tema.service';
import { Tema } from '../../../shared/models/tema.model';
import { Proposicao } from '../../../shared/models/proposicao.model';

@Component({
  selector: 'app-perguntas-container',
  templateUrl: './perguntas-container.component.html',
  styleUrls: ['./perguntas-container.component.scss']
})
export class PerguntasContainerComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  temaSelecionado: string;

  listaTemas: Tema[];
  listaProposicoes: Proposicao[];

  perguntasTemaSelecionado: Proposicao[];
  perguntaSelecionada: Proposicao;

  @Input() receivedTemas: number[];

  constructor(
    private perguntaService: PerguntaService,
    private temaService: TemaService
  ) { }

  ngOnInit() {
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
        console.log(this.listaTemas)
      },
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
    console.log(this.receivedTemas);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
