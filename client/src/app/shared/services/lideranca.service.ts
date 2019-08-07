import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Lideranca } from '../models/lideranca.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiderancaService {

  private url = environment.apiUrl + 'liderancas';

  constructor(private http: HttpClient) { }

  getLiderancas(): Observable<Lideranca[]> {
    return this.http.get<Lideranca[]>(this.url);
  }
}
