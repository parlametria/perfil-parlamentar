import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Proposicao } from '../models/proposicao.model';
import { Pergunta } from '../models/pergunta.model';


@Injectable({
  providedIn: 'root'
})
export class PerguntaService {

  private url = environment.apiUrl + 'perguntas';

  constructor(private http: HttpClient) { }

  getProposicoes(): Observable<Proposicao[]> {
    return this.http.get<Proposicao[]>(this.url + '/proposicoes');
  }

  getProposicao(id: string): Observable<Proposicao> {
    return this.http.get<Proposicao> (this.url + '/proposicoes/' + id);
  }

}
