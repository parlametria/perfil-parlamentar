import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { estados } from '../../../shared/constants/estados';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  isCollapsed: boolean;
  estados: string[];  

  estadoSelecionado: string;
  pesquisaPorNome: string;  

  constructor(
    private modalService: NgbModal    
  ) {
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
    let filtro = {
      nome: this.pesquisaPorNome,
      estado: this.estadoSelecionado
    }

    this.filterChange.emit(filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = "Estados"
    this.pesquisaPorNome = ""

    this.aplicarFiltro();
  }

}
