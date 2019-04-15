import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { estados } from '../../shared/constants/estados';
import { ParlamentarService } from '../../shared/services/parlamentar.service';
import { TemaService } from '../../shared/services/tema.service';
import { Tema } from '../../shared/models/tema.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();

  readonly FILTRO_PADRAO_ESTADO = 'Estados';
  readonly FILTRO_PADRAO_PARTIDO = 'Partidos';
  readonly FILTRO_PADRAO_TEMA = -1;
  filtro: any;

  private unsubscribe = new Subject();

  partidosPorEstado: any[];

  estados: string[];
  partidosFiltradosPorEstado: string[];
  temas: Tema[];

  temaSelecionado: number;
  estadoSelecionado: string;
  nomePesquisado: string;
  partidoSelecionado: string;

  constructor(
    private modalService: NgbModal,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService
  ) {
    this.estados = estados;
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.temaSelecionado = this.FILTRO_PADRAO_TEMA;

    this.filtro = {
      nome: '',
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      tema: this.temaSelecionado
    };
  }

  ngOnInit() {
    this.parlamentarService.getPartidosPorEstado().pipe(takeUntil(this.unsubscribe)).subscribe(
      partidos => {
        this.partidosPorEstado = partidos;
        this.onChangeEstado();
      }
    );

    this.getTemas();
    this.filterChange.emit(this.filtro);
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  onChangeEstado() {
    this.partidosFiltradosPorEstado = this.partidosPorEstado.filter(value => value.estado === this.estadoSelecionado)[0].partidos;

    if (!this.partidosFiltradosPorEstado.includes('Partidos')) {
      this.partidosFiltradosPorEstado.splice(0, 0, 'Partidos');
    }

    if (!this.partidosFiltradosPorEstado.includes(this.partidoSelecionado)) {
      this.partidoSelecionado = 'Partidos';
    }
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      tema: this.temaSelecionado
    };

    this.filterChange.emit(this.filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.nomePesquisado = '';
    this.temaSelecionado = this.FILTRO_PADRAO_TEMA;

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

  limparFiltroTema() {
    this.temaSelecionado = this.FILTRO_PADRAO_TEMA;
    this.aplicarFiltro();
  }

  getTemas() {
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe((temas) => {
      this.temas = temas;
    });
  }

  isTemaSelected(idTema: number) {
    return this.temaSelecionado === idTema;
  }

  selecionaTema(idTema: number) {
    if (this.temaSelecionado === idTema) {
      this.temaSelecionado = this.FILTRO_PADRAO_TEMA;
    } else {
      this.temaSelecionado = idTema;
    }
  }

  getTemaById(id: number) {
    if (this.temas && id !== this.FILTRO_PADRAO_TEMA) {
      return this.temas.filter(tema => tema.id === id)[0].tema;
    }
  }

}
