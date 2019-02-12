import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Tema } from '../models/tema.model';
import { Proposicao } from '../models/proposicao.model';
import { Pergunta } from '../models/pergunta.model';


@Injectable({
  providedIn: 'root'
})
export class PerguntaService {

  private url = environment.apiUrl + 'perguntas';

  constructor(private http: HttpClient) { }

  getPerguntas(): Observable<Pergunta[]> {
    return this.http.get<Pergunta[]>(this.url);
  }

  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.url + "/temas");
  }

  getProposicoes(): Observable<Proposicao[]> {
    return this.http.get<Proposicao[]>(this.url + "/proposicoes");
  }
}
