import { Component, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { ParlamentarService } from './../../shared/services/parlamentar.service';
import { TemaService } from './../../shared/services/tema.service';
import { PerguntaService } from './../../shared/services/pergunta.service';
import { UserService } from './../../shared/services/user.service';

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';
import { Tema } from 'src/app/shared/models/tema.model';
import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { Resposta } from 'src/app/shared/models/resposta.model';

@Component({
  selector: 'app-parlamentar',
  templateUrl: './parlamentar.component.html',
  styleUrls: ['./parlamentar.component.scss']
})
export class ParlamentarComponent implements OnInit {

  readonly FAVOR = 1;
  readonly NAOSEI = -2;
  readonly CONTRA = -1;

  private unsubscribe = new Subject();

  parlamentar: Parlamentar;
  temas: Tema[];
  proposicoes: Proposicao[];
  respostas: Resposta;

  constructor(
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private perguntaService: PerguntaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getParlamentarByCpf();
    this.getTemas();
    this.getProposicoes();
    this.getRespostas();
  }

  getParlamentarByCpf() {
    this.parlamentarService
      .getVotacoesParlamentarPorCpf("08430005463").
      pipe(takeUntil(this.unsubscribe)).
      subscribe(parlamentar => {
        this.parlamentar = parlamentar;
      },
      error => {
        console.log(error);
      });
  }

  getTemas() {
    this.temaService
      .getTemas()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        temas => {
          this.temas = temas;
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
          console.log(this.proposicoes);
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
        }, error => {
          console.log(error);
        })
  }

  private getBackgroundColor(resposta) {
    if (resposta === this.CONTRA) {
      return "#7F3C8B";
    } else if (resposta == this.FAVOR) {
      return "#43A467";
    } else {
      return "#EBE9E9";
    }
  }

  getUserBackgroundColor(id_votacao) {
    return(this.getBackgroundColor(this.respostas.votacoes[id_votacao]));
  }

  getParlamentarBackgroundColor(id_votacao) {
    console.log(this.parlamentar.votacoes[id_votacao]);
    return(this.getBackgroundColor(this.parlamentar.votacoes[id_votacao]));
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
