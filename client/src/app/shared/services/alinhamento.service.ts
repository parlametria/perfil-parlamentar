import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Parlamentar } from '../models/parlamentar.model';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AlinhamentoService {

  private url = environment.apiUrl + "alinhamento";

  constructor(
    private http: HttpClient
  ) { }

  get(respostas): Observable<any> {
    return this.http.post<Parlamentar[]>(this.url, { respostas: respostas.votacoes }).pipe(map(data => data.map(parlamentar => new Parlamentar(parlamentar))));
  }
}
