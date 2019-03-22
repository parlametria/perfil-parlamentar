import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, startWith, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Parlamentar } from '../models/parlamentar.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AlinhamentoService {

  private url = environment.apiUrl + "alinhamento";

  private searchTerm = new Subject<string>();

  parlamentaresFiltered = new BehaviorSubject<Array<Parlamentar>>([]);
  parlamentares = new BehaviorSubject<Array<Parlamentar>>([]);

  constructor(
    private http: HttpClient
  ) {
    this.parlamentares.pipe(
      switchMap(parlamentar => this.searchTerm
        .pipe(
          debounceTime(400),
          distinctUntilChanged(),
          map(term => this.filter(parlamentar, term)),
          startWith(parlamentar)
        ))
    ).subscribe(res => {
      this.parlamentaresFiltered.next(res);
    });
  }

  get(respostas): Observable<any> {
    this.http.post<Parlamentar[]>(this.url, { respostas: respostas.votacoes }).pipe(map(data => data.map(parlamentar => new Parlamentar(parlamentar))))
      .subscribe(res => {
        this.parlamentares.next(res);
      });

    return this.parlamentaresFiltered.asObservable();
  }

  search(term: string) {
    this.searchTerm.next(term);
  }

  private filter(parlamentar: Parlamentar[], value: string) {
    return parlamentar.filter(p => value && value !== "Estados" ? p.uf.toLowerCase() === value.toLowerCase() : parlamentar);
  }
}
