import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  private url = environment.apiUrl + 'temas';

  constructor(private http: HttpClient) { }

  getTemas(): Observable<any> {
    return this.http.get(this.url);
  }
}
