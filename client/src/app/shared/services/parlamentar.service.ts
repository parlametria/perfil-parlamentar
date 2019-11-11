import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Parlamentar } from '../models/parlamentar.model';
import { ParlamentarInfo } from '../models/parlamentarInfo.model';
import { ParlamentarPosicao } from '../models/parlamentarPosicao.model';
import { ParlamentarComissoes } from '../models/parlamentarComissoes.model';
import { ParlamentarLiderancas } from '../models/parlamentarLiderancas.model';
import { ParlamentarVotos } from '../models/parlamentarVotos.model';
import { ParlamentarInvestimento } from '../models/parlamentarInvestimento.model';
import { PartidoInvestimento } from '../models/partidoInvestimento.model';

@Injectable({
  providedIn: 'root'
})
export class ParlamentarService {
  private url = environment.apiUrl + 'parlamentares';

  constructor(private http: HttpClient) { }

  get(): Observable<Parlamentar[]> {
    return this.http.get<Parlamentar[]>(this.url + '/votacoes');
  }

  getPartidosPorEstado(casa: string): Observable<any[]> {
    const params = new HttpParams()
      .set('casa', casa);
    return this.http.get<any[]>(this.url + '/partidos', { params });
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

  getLiderancasByid(id: string): Observable<ParlamentarLiderancas> {
    return this.http
      .get<ParlamentarLiderancas>(this.url + '/' + id + '/liderancas');
  }

  getVotosbyId(id: string): Observable<ParlamentarVotos> {
    return this.http
      .get<ParlamentarVotos>(this.url + '/' + id + '/votos');
  }

  getInvestimentoById(id: string): Observable<ParlamentarInvestimento> {
    return this.http
      .get<ParlamentarInvestimento>(environment.apiUrl + 'investimento/parlamentar/' + id);
  }

  getInvestimentoPartido(idPartido: number, uf: string, esfera: string): Observable<PartidoInvestimento> {
    return this.http
      .get<PartidoInvestimento>(environment.apiUrl + 'investimento/partido/' + idPartido + '/' + uf + '/' + esfera);
  }
}
