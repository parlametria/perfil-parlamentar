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

}
