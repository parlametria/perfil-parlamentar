import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { LoginService } from './login.service';
import { PerguntaService } from './pergunta.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private respostas = new BehaviorSubject<any>({});

  constructor(
    private loginService: LoginService,
    private perguntaService: PerguntaService
  ) { }


  getRespostas() {
    this.getRespostasUser();
    return this.respostas.asObservable();
  }

  private getRespostasUser() {
    if (this.loginService.isUserLogged()) {
      // TODO: Pegar respostas da API
    } else {
      if (localStorage.getItem("respostasUser") === null) {
        this.initRespostasLocal();
      } else {        
        let respostasLS = this.getRespostaLocalStorage();
        this.respostas.next(respostasLS);
      }
    }
  }

  setResposta(novaResposta) {
    if (this.loginService.isUserLogged()) {
      // TODO: salvar respostas usando API
    } else {
      let respostasLS = this.getRespostaLocalStorage();
      let { id_votacao, resposta } = novaResposta;
      
      // Atualiza Resposta
      respostasLS.votacoes[id_votacao] = resposta;

      this.setRespostaLocalStorage(respostasLS);        
      
      this.respostas.next(respostasLS);
    }
  }

  private initRespostasLocal() {
    this.perguntaService.getProposicoes().subscribe(
      proposicoes => {
        let votacoes = proposicoes.reduce((result, item) => {
          let key = item.id_votacao;
          result[key] = 0;
          return result;
        }, {});

        let respostasUser = {
          vozAtiva: {},
          votacoes
        }
        this.setRespostaLocalStorage(respostasUser);        

        this.respostas.next(respostasUser);
      },
      error => console.log(error)
    );
  }

  private getRespostaLocalStorage() {
    return JSON.parse(localStorage.getItem("respostasUser"));
  }

  private setRespostaLocalStorage(novasRespostas) {
    localStorage.setItem('respostasUser', JSON.stringify(novasRespostas));
  }

}

