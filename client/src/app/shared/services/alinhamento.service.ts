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

import { Parlamentar } from '../models/parlamentar.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlinhamentoService {
  private url = environment.apiUrl + 'alinhamento';

  readonly FILTRO_PADRAO_TEMA = -1;

  private searchfilters = new BehaviorSubject<any>({});
  private tema: number;

  private parlamentaresFiltered = new BehaviorSubject<Array<Parlamentar>>([]);
  private parlamentares = new BehaviorSubject<Array<Parlamentar>>([]);

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
          let temaIndex;

          if (parlamentares.length !== 0) {
            temaIndex = parlamentares[0].alinhamento.temas.findIndex(res => res.idTema === this.tema);
          }
          return parlamentares.sort((a, b) => {
            if (this.tema !== undefined && this.tema !== this.FILTRO_PADRAO_TEMA) {
              return this.sortTema(a, b, temaIndex);
            } else {
              return this.sort(a, b);
            }
          });
        }),
      )
      .subscribe(res => {
        this.parlamentaresFiltered.next(res);
      });
  }

  get(respostas): Observable<any> {
    this.http
      .post<Parlamentar[]>(this.url, { respostas: respostas.votacoes })
      .pipe(map(data => data.map(parlamentar => new Parlamentar(parlamentar))))
      .subscribe(res => {
        this.parlamentares.next(res);
      });

    return this.parlamentaresFiltered.asObservable();
  }

  getAlinhamento(respostas): Observable<any> {
    return this.http
      .post<Parlamentar[]>(this.url, { respostas: respostas.votacoes })
      .pipe(map(data => data.map(parlamentar => new Parlamentar(parlamentar))));
  }

  search(filters: any) {
    this.searchfilters.next(filters);
    this.tema = filters.tema;
  }

  private filter(parlamentar: Parlamentar[], filters: any) {
    const estado = filters.estado;
    const nome = filters.nome;
    const partido = filters.partido;
    const comissao = filters.comissao;

    return parlamentar.filter(p => {
      let filtered;

      filtered =
        estado && estado !== 'Estados'
          ? p.uf.toLowerCase() === estado.toLowerCase()
          : true;

      filtered =
        partido && partido !== 'Partidos' && filtered
          ? p.parlamentarPartido.sigla.toLowerCase() === partido.toLowerCase()
          : filtered;

      filtered =
        comissao && comissao !== '-1' && filtered
          ? p.comissoes.filter(com => com.idComissaoVoz === comissao).length > 0
          : filtered;

      filtered =
        nome && filtered
          ? p.nomeEleitoral.toLowerCase().includes(nome.toLowerCase())
          : filtered;

      return filtered;
    });
  }

  /**
   * Ordena o resultado do alinhamento pelos seguintes critérios:
   *
   * 1. alinhamento
   * 2. respostas iguais
   *
   * @param a Parlamentar para comparação
   * @param b Parlamentar para comparação
   */
  private sort(a: Parlamentar, b: Parlamentar) {
    if (a.alinhamento.alinhamento > b.alinhamento.alinhamento) {
      return -1;
    } else if (a.alinhamento.alinhamento < b.alinhamento.alinhamento) {
      return 1;
    }
    if (a.alinhamento.perguntasIguais < 3 || b.alinhamento.perguntasIguais < 3) {
      if (a.alinhamento.perguntasIguais > b.alinhamento.perguntasIguais) {
        return -1;
      } else if (a.alinhamento.perguntasIguais < b.alinhamento.perguntasIguais) {
        return 1;
      }
    } else {
      if (a.alinhamento.respostasIguais > b.alinhamento.respostasIguais) {
        return -1;
      } else if (a.alinhamento.respostasIguais < b.alinhamento.respostasIguais) {
        return 1;
      }
    }
    return 0;
  }

  /**
   * Ordena o resultado do alinhamento pelos seguintes critérios considerando um tema específico:
   *
   * 1. alinhamento no tema
   * 2. respostas iguais no tema
   *
   * @param a Parlamentar para comparação
   * @param b Parlamentar para comparação
   */
  private sortTema(a: Parlamentar, b: Parlamentar, index: number) {
    if (a.alinhamento.temas[index].alinhamento > b.alinhamento.temas[index].alinhamento) {
      return -1;
    } else if (a.alinhamento.temas[index].alinhamento < b.alinhamento.temas[index].alinhamento) {
      return 1;
    }
    if (a.alinhamento.temas[index].perguntasIguais < 3 || b.alinhamento.temas[index].perguntasIguais < 3) {
      if (a.alinhamento.temas[index].perguntasIguais > b.alinhamento.temas[index].perguntasIguais) {
        return -1;
      } else if (a.alinhamento.temas[index].perguntasIguais < b.alinhamento.temas[index].perguntasIguais) {
        return 1;
      }
    } else {
      if (a.alinhamento.temas[index].respostasIguais > b.alinhamento.temas[index].respostasIguais) {
        return -1;
      } else if (a.alinhamento.temas[index].respostasIguais < b.alinhamento.temas[index].respostasIguais) {
        return 1;
      }
    }
    return 0;
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
      p.comissao === q.comissao;
  }

}
