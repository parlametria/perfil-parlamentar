import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CasaService {

  private casa = new BehaviorSubject<string>('camara');

  constructor() {}

  get(): Observable<string> {
    return this.casa;
  }

  set(casa: string) {
    this.casa.next(casa);
  }

  // Recupera casa a partir do id do parlamentar
  // Ids começados com 1 são da câmara, com 2 são do senado
  // Retorna undefined se nenhuma dessas condições é satisfeita
  getCasaFromId(id: string) {
    if (id !== undefined) {
      if (id.charAt(0) === '1') {
        return 'camara';
      } else if (id.charAt(0) === '2') {
        return 'senado';
      }
    }
    return undefined;
  }

  getNomeCasa(casa: string, preposicao: boolean): string {
    if (casa === 'camara') {
      const prep = (preposicao) ? 'da ' : '';
      return prep + 'câmara';
    } else if (casa === 'senado') {
      const prep = (preposicao) ? 'do ' : '';
      return prep + 'senado';
    }
    return '';
  }

}
