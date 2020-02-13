import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Comissao } from '../models/comissao.model';
import { CargoParlamentar } from '../models/cargoParlamentar.model';
import { CasaService } from './casa.service';


@Injectable({
  providedIn: 'root'
})
export class ComissaoService {

  private url = environment.apiUrl + 'comissoes';

  constructor(
    private http: HttpClient) { }

  getComissoes(casa: string): Observable<Comissao[]> {
    const params = new HttpParams()
      .set('casa', casa);
    return this.http.get<Comissao[]>(this.url, { params });
  }

  getCargos(casa: string): Observable<CargoParlamentar[]> {
    const params = new HttpParams()
      .set('casa', casa);
    return this.http.get<CargoParlamentar[]>(this.url + '/cargos', { params });
  }
}
