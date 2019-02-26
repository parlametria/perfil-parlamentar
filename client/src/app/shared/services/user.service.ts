import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { LoginService } from './login.service';
import { PerguntaService } from './pergunta.service';
import { environment } from '../../../environments/environment';
import { Resposta } from '../models/resposta.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private respostas = new BehaviorSubject<Resposta>({ vozAtiva: {}, votacoes: {} });
  private temas = new BehaviorSubject<Array<string>>([]);

  private url = environment.apiUrl + "usuarios";

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private perguntaService: PerguntaService
  ) { }


  getRespostas() {
    this.getRespostasUser();
    return this.respostas.asObservable();
  }

  private getRespostasUser() {
    if (this.loginService.isUserLogged()) {
      this.getRespostasAPI().subscribe(
        res => {
          // Checa se o usuário tem alguma resposta salva no banco de dados
          if (Object.values(res.votacoes).every(item => item === 0)) {
            this.setRespostasAPI(this.getRespostaLocalStorage()).subscribe(
              respostas => {
                this.respostas.next(respostas);
              }
            );
          } else {
            this.respostas.next(res);
          }
        },
        error => console.log(error)
      )
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

      let respostasAtual = this.respostas.getValue();

      // Atualiza Resposta
      respostasAtual.votacoes[novaResposta.id_votacao] = novaResposta.resposta;

      this.setRespostasAPIbyID(novaResposta.id_votacao, respostasAtual).subscribe(
        res => {
          this.respostas.next(res);
        },
        error => console.log(error)
      );

    } else {
      let respostasLS = this.getRespostaLocalStorage();
      let { id_votacao, resposta } = novaResposta;

      // Atualiza Resposta
      respostasLS.votacoes[id_votacao] = resposta;

      this.setRespostaLocalStorage(respostasLS);

      this.respostas.next(respostasLS);
    }
  }

  getRespostasAPI(): Observable<Resposta> {
    return this.http.get<Resposta>(this.url + "/respostas/eu");
  }

  setRespostasAPIbyID(idVotacao, novasRespostas): Observable<Resposta> {
    return this.http.post<Resposta>(this.url + "/respostas/eu?idResp=" + idVotacao, { respostas: novasRespostas })
  }

  setRespostasAPI(novasRespostas): Observable<Resposta> {
    return this.http.post<Resposta>(this.url + "/respostas/eu/todas", novasRespostas)
  }

  private initRespostasLocal() {
    this.perguntaService.getProposicoes().subscribe(
      proposicoes => {
        let votacoes = proposicoes.reduce((result, item) => {
          let key = item.id_votacao;
          result[key] = 0;
          return result;
        }, {});

        let respostasUser: Resposta = {
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

  getTemas() {
    this.getTemasUser();
    return this.temas.asObservable();
  }

  setTemas(novosTemas) {
    if (this.loginService.isUserLogged()) {
      // TODO: if user is logged      

    } else {
      this.setTemasLocalStorage(novosTemas);
      this.temas.next(novosTemas);
    }
  }

  private getTemasUser() {
    if (this.loginService.isUserLogged()) {
      // TODO: if user is logged
    } else {
      if (localStorage.getItem("temasUser") === null) {
        this.setTemasLocalStorage([]);
      } else {
        let temasLS = this.getTemasLocalStorage();
        this.temas.next(temasLS);
      }
    }
  }  

  getTemasLocalStorage() {
    return JSON.parse(localStorage.getItem("temasUser"));
  }

  private setTemasLocalStorage(novosTemas) {
    localStorage.setItem('temasUser', JSON.stringify(novosTemas));
  }

}

