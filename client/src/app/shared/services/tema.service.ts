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

  readonly ID_PADRAO_TEMA_TODOS = '99';
  readonly SLUG_PADRAO_TEMA_TODOS = 'todos';

  constructor(private http: HttpClient) { }

  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.url);
  }

  getTemaSlugById(temas: Tema[], id: number): string {
    let temaSlug;

    if (temas !== undefined && temas.length > 0) {
      temaSlug = temas.filter(t => t.idTema === id);
    }

    if (temaSlug !== undefined && temaSlug.length > 0) {
      return temaSlug[0].slug;
    } else {
      return this.SLUG_PADRAO_TEMA_TODOS;
    }
  }

  getTemaIdBySlug(temas: Tema[], slug: string): string {
    const tema = temas.filter(t => t.slug === slug);

    if (tema && tema.length > 0) {
      return String(tema[0].idTema);
    } else {
      return this.ID_PADRAO_TEMA_TODOS;
    }
  }
}
