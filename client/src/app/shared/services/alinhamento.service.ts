import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Parlamentar } from '../models/parlamentar.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlinhamentoService {

  private url = environment.apiUrl + "alinhamento";

  constructor(
    private http: HttpClient
  ) { }

  get(respostas): Observable<Parlamentar[]> {
    return this.http.post<Parlamentar[]>(this.url, { params: {respostas: respostas} });
  }
}
