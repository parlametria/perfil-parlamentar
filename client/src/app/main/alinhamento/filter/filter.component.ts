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

  readonly FILTRO_PADRAO_ESTADO = "Estados";
  readonly FILTRO_PADRAO_PARTIDO = "Partidos";
  filtro: any;

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
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;

    this.filtro = {
      nome: "",
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado
    }
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
    this.filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado
    }

    this.filterChange.emit(this.filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.nomePesquisado = "";

    this.aplicarFiltro();
  }

  limparFiltroEstado() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.onChangeEstado();
    this.aplicarFiltro();
  }

  limparFiltroPartido() {
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.aplicarFiltro();
  }

}
