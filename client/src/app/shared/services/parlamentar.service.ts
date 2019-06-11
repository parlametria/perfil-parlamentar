import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Parlamentar } from '../models/parlamentar.model';
import { ParlamentarInfo } from '../models/parlamentarInfo.model';
import { ParlamentarPosicao } from '../models/parlamentarPosicao.model';
import { ParlamentarComissoes } from '../models/parlamentarComissoes.model';

@Injectable({
  providedIn: 'root'
})
export class ParlamentarService {
  private url = environment.apiUrl + 'parlamentares';

  constructor(private http: HttpClient) { }

  get(): Observable<Parlamentar[]> {
    return this.http.get<Parlamentar[]>(this.url + '/votacoes');
  }

  getPartidosPorEstado(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/partidos');
  }

  getVotacoesParlamentarPorId(id: string): Observable<Parlamentar> {
    return this.http
      .get<Parlamentar>(this.url + '/' + id + '/votacoes')
      .pipe(map(parlamentar => {
        return new Parlamentar(parlamentar);
      }));
  }

  getInfoById(id: string): Observable<ParlamentarInfo> {
    return this.http
      .get<ParlamentarInfo>(this.url + '/' + id + '/info')
      .pipe(map(parlamentar => {
        return new ParlamentarInfo(parlamentar);
      }));
  }

  getPosicoesById(id: string): Observable<ParlamentarPosicao> {
    return this.http
      .get<ParlamentarPosicao>(this.url + '/' + id + '/posicoes');
  }

  getComissoesByid(id: string): Observable<ParlamentarComissoes> {
    return this.http
      .get<ParlamentarComissoes>(this.url + '/' + id + '/comissoes');
  }
}
