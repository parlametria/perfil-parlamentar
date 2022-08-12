import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { EmpresasRelacionadas } from '../models/empresasRelacionadas.model';

@Injectable({
  providedIn: 'root'
})
export class PerfilPoliticoService {

  private url = 'https://api-perfilpolitico.serenata.ai/api/';

  constructor(private http: HttpClient) { }

  get(idPerfilPolitico: string): Observable<any> {
    return this.http.get<[]>(this.url + 'candidate/' + idPerfilPolitico + '/');
  }

  getEconomicBonds(idPerfilPolitico: string): Observable<EmpresasRelacionadas>{
    const endpointPath = 'economic-bonds/candidate/';
    return this.http.get<EmpresasRelacionadas>(this.url + endpointPath + idPerfilPolitico + '/')
      .pipe(take(1))
      .pipe(map(resp => new EmpresasRelacionadas(resp)));
  }

  getAssetStats(): Observable<any>{
    return this.http.get<[]>(this.url + 'asset-stats');
  }
}
