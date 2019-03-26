import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { estados } from '../../../shared/constants/estados';

import { ParlamentarService } from '../../../shared/services/parlamentar.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  private unsubscribe = new Subject();

  partidosPorEstado: any[];

  estados: string[];
  partidosFiltradosPorEstado: string[];

  estadoSelecionado: string;
  nomePesquisado: string;
  partidoSelecionado: string;  

  constructor(
    private modalService: NgbModal,
    private parlamentarService: ParlamentarService
  ) {
    this.estados = estados;

    this.estadoSelecionado = "Estados";
    this.partidoSelecionado = "Partidos";
  }

  ngOnInit() {
    this.parlamentarService.getPartidosPorEstado().pipe(takeUntil(this.unsubscribe)).subscribe(
      partidos => {
        this.partidosPorEstado = partidos;
        this.onChangeEstado();
      }
    )
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  onChangeEstado() {
    this.partidosFiltradosPorEstado = this.partidosPorEstado.filter(value => value.estado === this.estadoSelecionado)[0].partidos;
    
    if (!this.partidosFiltradosPorEstado.includes("Partidos"))
      this.partidosFiltradosPorEstado.splice(0, 0, "Partidos");

    if (!this.partidosFiltradosPorEstado.includes(this.partidoSelecionado)) {
      this.partidoSelecionado = "Partidos";
    }
  }

  aplicarFiltro() {
    let filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado
    }

    this.filterChange.emit(filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = "Estados";
    this.partidoSelecionado = "Partidos";
    this.nomePesquisado = "";

    this.aplicarFiltro();
  }

}
