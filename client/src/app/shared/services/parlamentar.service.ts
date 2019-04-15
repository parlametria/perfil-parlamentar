import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Parlamentar } from '../models/parlamentar.model';

@Injectable({
  providedIn: 'root'
})
export class ParlamentarService {
  private url = environment.apiUrl + 'candidatos';

  constructor(private http: HttpClient) {}

  get(): Observable<Parlamentar[]> {
    return this.http.get<Parlamentar[]>(this.url + '/votacoes');
  }

  getPartidosPorEstado(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/partidos');
  }

  getVotacoesParlamentarPorCpf(cpf: string): Observable<Parlamentar> {
    return this.http
      .get<Parlamentar>(this.url + '/' + cpf + '/votacoes')
      .pipe(map(parlamentar => new Parlamentar(parlamentar)));
  }
}
