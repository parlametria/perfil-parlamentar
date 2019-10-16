import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Orientacao } from '../models/orientacao.model';
import { Proposicao } from '../models/proposicao.model';

@Injectable({
  providedIn: 'root'
})
export class OrientacaoService {
  private url = environment.apiUrl + 'orientacoes';

  constructor(private http: HttpClient) { }

  getOrientacoesGoverno(): Observable<Orientacao> {
    return this.http
      .get<Orientacao>(this.url + '/governo' );
  }

  getProposicoesOrientacao(casa: string): Observable<Proposicao[]> {
    const params = new HttpParams().set('casa', casa);

    return this.http
      .get<Proposicao[]>(this.url + '/proposicoes', { params });
  }
}
