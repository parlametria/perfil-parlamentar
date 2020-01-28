import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CountVotacao } from '../models/countVotacao.model';

@Injectable({
  providedIn: 'root'
})
export class VotacaoService {
  private url = environment.apiUrl + 'votacoes';


  constructor(private http: HttpClient) { }

  getCountVotacoes(casa: string): Observable<CountVotacao> {
    const params = new HttpParams().set('casa', casa);

    return this.http
      .get<CountVotacao>(this.url + '/', { params });
  }

  getCountVotacoesPorTema(casa: string): Observable<any> {
    const params = new HttpParams().set('casa', casa);

    return this.http
      .get(this.url + '/temas/', { params });
  }

}
