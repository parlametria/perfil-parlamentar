import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { estados } from '../../../shared/constants/estados';

import { ParlamentarService } from '../../../shared/services/parlamentar.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  isCollapsed: boolean;  
  estados: string[];
  partidosPorEstado: any[];

  partidosFiltradosPorEstado: string[];

  estadoSelecionado: string;
  pesquisaPorNome: string;
  partidoSelecionado: string;
  
  constructor(
    private modalService: NgbModal,
    private parlamentarService: ParlamentarService
  ) {
    this.isCollapsed = true;
    this.estados = estados;

    this.estadoSelecionado = "Estados";
    this.partidoSelecionado = "Partidos";
  }

  ngOnInit() {
    this.parlamentarService.getPartidosPorEstado().subscribe(
      partidos => {
        console.log(partidos);
        this.partidosPorEstado = partidos;
        this.partidosFiltradosPorEstado = partidos.filter(value => value.estado === this.estadoSelecionado)[0].partidos;
        this.partidosFiltradosPorEstado.splice(0, 0, "Partidos");
      }
    )
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  onChangeEstado() {        
    this.partidosFiltradosPorEstado = this.partidosPorEstado.filter(value => value.estado === this.estadoSelecionado)[0].partidos;    
    this.partidosFiltradosPorEstado.splice(0, 0, "Partidos");
  }

  aplicarFiltro() {
    let filtro = {
      nome: this.pesquisaPorNome,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado
    }

    this.filterChange.emit(filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = "Estados";
    this.partidoSelecionado = "Partidos";
    this.pesquisaPorNome = "";
    

    this.aplicarFiltro();
  }

}
