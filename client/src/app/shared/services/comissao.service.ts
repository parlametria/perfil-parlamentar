import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Comissao } from '../models/comissao.model';


@Injectable({
  providedIn: 'root'
})
export class ComissaoService {

  private url = environment.apiUrl + 'comissoes';

  constructor(private http: HttpClient) { }

  getComissoes(): Observable<Comissao[]> {
    return this.http.get<Comissao[]>(this.url);
  }
}
