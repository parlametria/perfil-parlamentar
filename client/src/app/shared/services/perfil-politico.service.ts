import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerfilPoliticoService {

  private url = 'https://api-perfilpolitico.serenata.ai/api/';

  constructor(private http: HttpClient) { }

  get(idPerfilPolitico: string): Observable<any> {
    return this.http.get<[]>(this.url + 'candidate/' + idPerfilPolitico);
  }

}
