import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import {
  switchMap,
  map,
  tap,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';


import { environment } from '../../../environments/environment';
import { ParlamentarAderencia } from '../models/parlamentarAderencia.model';
import { Aderencia, AderenciaDados } from '../models/aderencia.model';

@Injectable({
  providedIn: 'root'
})
export class AderenciaService {

  private url = environment.apiUrl + 'aderencia';

  readonly FILTRO_PADRAO_TEMA = -1;
  readonly ID_TEMA_GERAL = 99;

  private searchfilters = new BehaviorSubject<any>({});
  private tema: number;
  private orderBy;
  private orientador = 'Governo';

  private parlamentaresFiltered = new BehaviorSubject<Array<ParlamentarAderencia>>([]);
  private parlamentares = new BehaviorSubject<Array<ParlamentarAderencia>>([]);

  constructor(private http: HttpClient) {
    this.parlamentares
      .pipe(
        switchMap(parlamentar =>
          this.searchfilters.pipe(
            debounceTime(400),
            distinctUntilChanged(
              (p: any, q: any) => {
                return this.compareFilter(p, q);
              }
            ),
            map(filters => this.filter(parlamentar, filters))
          )
        ),
        tap(parlamentares => {
          let idTema = this.tema;

          if (this.tema === this.FILTRO_PADRAO_TEMA) {
            idTema = this.ID_TEMA_GERAL;
          }

          if (this.orderBy === 'ASC') {
            return parlamentares.sort((a, b) => {
              return this.sort(b, a, idTema);
            });
          } else {
            return parlamentares.sort((a, b) => {
              return this.sort(a, b, idTema);
            });
          }
        }),
      )
      .subscribe(res => {
        this.parlamentaresFiltered.next(res);
      });
  }

  getAderenciaById(id: string): Observable<Aderencia> {
    return this.http.get<Aderencia>(this.url + '/parlamentar/' + id);
  }

  getAderencia(): Observable<any> {
    this.http
      .get<ParlamentarAderencia[]>(this.url + '/parlamentar/')
      .pipe(map(data => data.map(parlamentar => new ParlamentarAderencia(parlamentar))))
      .subscribe(res => {
        this.parlamentares.next(res);
      });

    return this.parlamentaresFiltered.asObservable();
  }

  getAderenciaAsObservable(): Observable<any> {
    return this.http
      .get<ParlamentarAderencia[]>(this.url + '/parlamentar/')
      .pipe(map(data => data.map(parlamentar => new ParlamentarAderencia(parlamentar))));
  }

  search(filters: any, orderBy: string) {
    this.tema = filters.tema;
    this.orderBy = orderBy;
    this.orientador = filters.orientador;
    this.searchfilters.next(filters);
  }

  private filter(parlamentar: ParlamentarAderencia[], filters: any) {
    const estado = filters.estado;
    const nome = filters.nome;
    const partido = filters.partido;
    const comissao = filters.comissao;
    const lideranca = filters.lideranca;
    const cargoComissao = filters.cargoComissao;
    const casa = filters.casa;

    return parlamentar.filter(p => {
      let filtered;

      filtered =
        casa ? p.casa.toLowerCase() === casa.toLowerCase()
          : true;

      filtered =
        estado && estado !== 'Estados' && filtered
          ? p.uf.toLowerCase() === estado.toLowerCase()
          : filtered;

      filtered =
        partido && partido !== 'Partidos' && filtered
          ? p.parlamentarPartido.sigla.toLowerCase() === partido.toLowerCase()
          : filtered;

      filtered =
        comissao && comissao !== '-1' && filtered
          ? p.comissoes.filter(com => com.idComissaoVoz === comissao).length > 0
          : filtered;

      filtered =
        lideranca && lideranca !== 'Lideranças partidárias' && filtered
          ? p.parlamentarLiderancas.filter(l => l.cargo === lideranca).length > 0
          : filtered;

      filtered =
        cargoComissao && cargoComissao !== 'Cargo em comissões' && filtered
          ? p.comissoes.filter(c => c.cargo === cargoComissao).length > 0
          : filtered;

      filtered =
        nome && filtered
          ? p.nomeProcessado.toLowerCase().includes(nome.toLowerCase())
          : filtered;

      return filtered;
    });
  }

  /**
   * Compara se dois filtros são iguais ou não
   *
   * @param p Filtro para comparação
   * @param q Filtro para comparação
   */
  private compareFilter(p: any, q: any) {
    return p.estado === q.estado &&
      p.nome === q.nome &&
      p.tema === q.tema &&
      p.partido === q.partido &&
      p.orientador === q.orientador &&
      p.comissao === q.comissao &&
      p.lideranca === q.lideranca &&
      p.cargoComissao === q.cargoComissao &&
      p.casa === q.casa &&
      p.temaSlug === q.temaSlug &&
      p.orderBy === q.orderBy;
  }

  /**
   * Ordena o resultado do aderência pelos seguintes critérios:
   *
   * 1. Aderência
   * 2. Seguiu
   *
   * @param a Parlamentar para comparação
   * @param b Parlamentar para comparação
   */
  public sort(a: ParlamentarAderencia, b: ParlamentarAderencia, idTema) {
    let aderenciaA: AderenciaDados;
    let aderenciaB: AderenciaDados;

    if (this.orientador === 'Governo') {
      aderenciaA = a.aderencia.filter(aderencia =>
        aderencia.aderenciaTema.idTema === idTema && aderencia.partido.sigla === this.orientador)[0];
      aderenciaB = b.aderencia.filter(aderencia =>
        aderencia.aderenciaTema.idTema === idTema && aderencia.partido.sigla === this.orientador)[0];
    } else {
      aderenciaA = a.aderencia.filter(aderencia =>
        aderencia.aderenciaTema.idTema === idTema && aderencia.partido.idPartido === a.parlamentarPartido.idPartido)[0];
      aderenciaB = b.aderencia.filter(aderencia =>
        aderencia.aderenciaTema.idTema === idTema && aderencia.partido.idPartido === b.parlamentarPartido.idPartido)[0];
    }

    let order = 1;
    if (this.orderBy === 'DESC') {
      order = -1;
    }

    if (aderenciaA === undefined) {
      return -1 * order;
    }

    if (aderenciaB === undefined) {
      return 1 * order;
    }

    if (aderenciaA !== undefined && aderenciaB !== undefined) {

      if (aderenciaA.aderencia === -1) {
        return -1 * order;
      }

      if (aderenciaB.aderencia === -1) {
        return 1 * order;
      }

      if (aderenciaA.aderencia > aderenciaB.aderencia) {
        return -1;
      } else if (aderenciaA.aderencia < aderenciaB.aderencia) {
        return 1;
      }

      if (aderenciaA.seguiu > aderenciaB.seguiu) {
        return -1;
      } else if (aderenciaA.seguiu < aderenciaB.seguiu) {
        return 1;
      }
    }
    return 0;
  }

}
