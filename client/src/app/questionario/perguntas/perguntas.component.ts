import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PerguntaService } from '../../shared/services/pergunta.service';
import { Tema } from '../../shared/models/tema.model';
import { Proposicao } from '../../shared/models/proposicao.model';

@Component({
  selector: 'app-perguntas',
  templateUrl: './perguntas.component.html',
  styleUrls: ['./perguntas.component.scss']
})
export class PerguntasComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  private temaSelecionado;

  private listaTemas: Tema[];
  private listaProposicoes: Proposicao[];

  perguntaSelecionada: Proposicao;

  constructor(private perguntaService: PerguntaService) {
    // Inicia tema a partir do ID
    this.temaSelecionado = 3;        
  }

  ngOnInit() {
    this.perguntaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe(
      temas => this.listaTemas = temas,
      error => console.log(error)
    );
    
    this.perguntaService.getProposicoes().pipe(takeUntil(this.unsubscribe)).subscribe(
      proposicoes =>  {
        this.listaProposicoes = proposicoes;
        this.perguntaSelecionada = proposicoes[6];
      },
      error => console.log(error)
    );    
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
