import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { estados } from '../../../shared/constants/estados';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  isCollapsed: boolean;
  estados: Array<string>;

  estadoSelecionado: string;
  pesquisaPorNome: string;

  constructor(private modalService: NgbModal) {
    this.isCollapsed = true;
    this.estados = estados;

    this.estadoSelecionado = "Estados";
  }

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  aplicarFiltro() {
    let filtro =  {
      nome: this.pesquisaPorNome,
      estado: this.estadoSelecionado
    }

    this.filterChange.emit(filtro);
    this.modalService.dismissAll();
  }

}
