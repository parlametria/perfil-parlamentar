import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerguntaService {

  private url = environment.apiUrl + 'perguntas';

  constructor(private http: HttpClient) { }

  getPerguntas(): Observable<any> {
    return this.http.get(this.url);
  }
}
