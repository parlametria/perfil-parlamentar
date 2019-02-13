import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Tema } from '../models/tema.model';

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  private url = environment.apiUrl + 'temas';

  constructor(private http: HttpClient) { }

  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.url);
  }
}
