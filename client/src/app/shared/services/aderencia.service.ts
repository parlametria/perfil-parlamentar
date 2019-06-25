import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Aderencia } from '../models/aderencia.model';

@Injectable({
  providedIn: 'root'
})
export class AderenciaService {

  private url = environment.apiUrl + 'aderencia';

  constructor(private http: HttpClient) { }

  getAderenciaById(id: string): Observable<Aderencia> {
    return this.http.get<Aderencia>(this.url + '/parlamentar/' + id);
  }

}
