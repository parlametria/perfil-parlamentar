import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, Subject, BehaviorSubject } from "rxjs";
import {
  switchMap,
  startWith,
  map,
  tap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

import { Parlamentar } from "../models/parlamentar.model";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class AlinhamentoService {
  private url = environment.apiUrl + "alinhamento";

  private searchfilters = new Subject<any>();

  parlamentaresFiltered = new BehaviorSubject<Array<Parlamentar>>([]);
  parlamentares = new BehaviorSubject<Array<Parlamentar>>([]);

  constructor(private http: HttpClient) {
    this.parlamentares
      .pipe(
        switchMap(parlamentar =>
          this.searchfilters.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            map(filters => this.filter(parlamentar, filters)),
            startWith(parlamentar)
          )
        ),
        tap(parlamentares => parlamentares.sort((a, b) => this.sort(a, b)))
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

  search(filters: any) {
    this.searchfilters.next(filters);
  }

  private filter(parlamentar: Parlamentar[], filters: any) {
    let estado = filters.estado;
    let nome = filters.nome;
    let partido = filters.partido;

    return parlamentar.filter(p => {
      let filtered;

      filtered =
        estado && estado !== "Estados"
          ? p.uf.toLowerCase() === estado.toLowerCase()
          : true;

      filtered =
        partido && partido !== "Partidos" && filtered
          ? p.sg_partido.toLowerCase().includes(partido.toLowerCase())
          : filtered;

      filtered =
        nome && filtered
          ? p.nome_urna.toLowerCase().includes(nome.toLowerCase())
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
   * @param a
   * @param b
   */
  private sort(a: Parlamentar, b: Parlamentar) {
    if (a.alinhamento.alinhamento > b.alinhamento.alinhamento) {
      return -1;
    } else if (a.alinhamento.alinhamento < b.alinhamento.alinhamento) {
      return 1
    } else if (a.alinhamento.respostasIguais > b.alinhamento.respostasIguais) {
      return -1;
    } else if (a.alinhamento.respostasIguais < b.alinhamento.respostasIguais) {
      return 1;
    }
    return 0;
  }
}
