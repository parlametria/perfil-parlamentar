import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TemaService } from 'src/app/shared/services/tema.service';
import { Tema } from '../../shared/models/tema.model';

@Component({
  selector: 'app-temas',
  templateUrl: './temas.component.html',
  styleUrls: ['./temas.component.scss']
})
export class TemasComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  temas: Tema[];
  selectedTemas: number[] = [];
  hasAnySelectedTema = false;

  @Output() temasEvent = new EventEmitter<object>();

  constructor(private temaService: TemaService) { }

  ngOnInit() {
    this.getTemas();
  }

  getTemas() {
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe((temas) => {
      this.temas = temas;
    });
  }

  clickButton(idTema) {
    if (!this.isTemaSelected(idTema)) {
      this.hasAnySelectedTema = true;
      this.selectedTemas.push(idTema);
    } else {
      this.selectedTemas.splice(this.selectedTemas.indexOf(idTema), 1);
      if (this.selectedTemas.length === 0) {
        this.hasAnySelectedTema = false;
      }
    }
  }

  isTemaSelected(idTema) {
    return (this.selectedTemas.includes(idTema));
  }

  emitTemas() {
    const notSelectedTemas = this.temas.filter((tema) => {
      return !this.selectedTemas.includes(tema.idTema);
    }).map(tema => tema.idTema);

    const eventoObject = {
      selectedTemas: this.selectedTemas,
      allTemas: this.selectedTemas.concat(notSelectedTemas),
    };

    this.temasEvent.emit(eventoObject);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
