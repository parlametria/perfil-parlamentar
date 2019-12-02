import { Component, EventEmitter, OnInit, Output, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { estados } from '../shared/constants/estados';
import { ParlamentarService } from '../shared/services/parlamentar.service';
import { Tema } from '../shared/models/tema.model';
import { TemaService } from '../shared/services/tema.service';
import { Comissao } from '../shared/models/comissao.model';
import { ComissaoService } from '../shared/services/comissao.service';
import { Lideranca } from '../shared/models/lideranca.model';
import { LiderancaService } from '../shared/services/lideranca.service';
import { CasaService } from '../shared/services/casa.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {

  @Input() exibirTemas: boolean;
  @Output() filterChange = new EventEmitter<any>();

  readonly FILTRO_PADRAO_ESTADO = 'Estados';
  readonly FILTRO_PADRAO_PARTIDO = 'Partidos';
  readonly FILTRO_PADRAO_COMISSAO = 'Comissões';
  readonly FILTRO_PADRAO_COMISSAO_VALUE = '-1';
  readonly FILTRO_PADRAO_TEMA = -1;
  readonly FILTRO_PADRAO_TEMA_SLUG = 'todos';
  readonly FILTRO_PADRAO_LIDERANCA = 'Lideranças partidárias';
  readonly FILTRO_PADRAO_CARGO_COMISSAO = 'Cargo em comissões';

  filtro: any;

  private unsubscribe = new Subject();

  partidosPorEstado: any[];

  estados: string[];
  partidosFiltradosPorEstado: string[];
  temas: Tema[];
  comissoes: Comissao[];
  liderancas: Lideranca[];
  cargosComissao: Lideranca[];

  temaSelecionado: number;
  estadoSelecionado: string;
  nomePesquisado: string;
  partidoSelecionado: string;
  comissaoSelecionada: string;
  liderancaSelecionada: string;
  cargoComissaoSelecionado: string;
  casaSelecionada: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private parlamentarService: ParlamentarService,
    private temaService: TemaService,
    private comissaoService: ComissaoService,
    private liderancaService: LiderancaService,
    private casaService: CasaService
  ) {
    this.estados = estados;
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.temaSelecionado = this.FILTRO_PADRAO_TEMA;
    this.comissaoSelecionada = this.FILTRO_PADRAO_COMISSAO_VALUE;
    this.liderancaSelecionada = this.FILTRO_PADRAO_LIDERANCA;
    this.cargoComissaoSelecionado = this.FILTRO_PADRAO_CARGO_COMISSAO;

    this.filtro = {
      nome: '',
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      comissao: this.comissaoSelecionada,
      tema: this.temaSelecionado,
      temaSlug: this.FILTRO_PADRAO_TEMA_SLUG,
      lideranca: this.liderancaSelecionada,
      cargoComissao: this.cargoComissaoSelecionado,
      default: true
    };
  }

  ngOnInit() {
    this.casaService.get().subscribe(casa => {
      this.casaSelecionada = casa;
      this.getPartidoPorEstado(casa);
      this.getComissoes(casa);
      this.getLiderancas(casa);
      this.getCargosComissao(casa);
      this.aplicarFiltro();
    });
    this.updateFiltroViaUrl();
    this.getTemas();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'Filtros para Alinhamento' });
  }

  onChangeEstado() {
    this.partidosFiltradosPorEstado = this.partidosPorEstado.filter(value => value.estado === this.estadoSelecionado)[0].partidos;

    if (!this.partidosFiltradosPorEstado.includes(this.FILTRO_PADRAO_PARTIDO)) {
      this.partidosFiltradosPorEstado.splice(0, 0, this.FILTRO_PADRAO_PARTIDO);
    }

    if (!this.partidosFiltradosPorEstado.includes(this.partidoSelecionado)) {
      this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    }
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      comissao: this.comissaoSelecionada,
      tema: this.temaSelecionado,
      temaSlug: this.temaService.getTemaSlugById(this.temas, this.temaSelecionado),
      orientador: undefined,
      lideranca: this.liderancaSelecionada,
      cargoComissao: this.cargoComissaoSelecionado,
      casa: this.casaSelecionada,
      default: this.isFiltroDefault()
    };

    this.updateUrlFiltro(this.filtro);

    this.filterChange.emit(this.filtro);
    this.modalService.dismissAll();
  }

  limparFiltro() {
    this.estadoSelecionado = this.FILTRO_PADRAO_ESTADO;
    this.partidoSelecionado = this.FILTRO_PADRAO_PARTIDO;
    this.comissaoSelecionada = this.FILTRO_PADRAO_COMISSAO_VALUE;
    this.nomePesquisado = '';
    this.temaSelecionado = this.FILTRO_PADRAO_TEMA;
    this.liderancaSelecionada = this.FILTRO_PADRAO_LIDERANCA;
    this.cargoComissaoSelecionado = this.FILTRO_PADRAO_CARGO_COMISSAO;

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

  limparFiltroComissao() {
    this.comissaoSelecionada = this.FILTRO_PADRAO_COMISSAO_VALUE;
    this.aplicarFiltro();
  }

  limparFiltroTema() {
    this.temaSelecionado = this.FILTRO_PADRAO_TEMA;
    this.aplicarFiltro();
  }

  limparFiltroLideranca() {
    this.liderancaSelecionada = this.FILTRO_PADRAO_LIDERANCA;
    this.aplicarFiltro();
  }

  limparFiltroCargoComissao() {
    this.cargoComissaoSelecionado = this.FILTRO_PADRAO_CARGO_COMISSAO;
    this.aplicarFiltro();
  }

  getTemas() {
    this.temaService.getTemas().pipe(takeUntil(this.unsubscribe)).subscribe((temas) => {
      this.temas = temas;
    });
  }

  getPartidoPorEstado(casa: string) {
    this.parlamentarService
    .getPartidosPorEstado(casa)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(
      partidos => {
        this.partidosPorEstado = partidos;
        this.onChangeEstado();
      }
    );
  }

  getComissoes(casa: string) {
    this.comissaoService.getComissoes(casa).pipe(takeUntil(this.unsubscribe)).subscribe((comissoes) => {

      comissoes.map(c => c.nome = c.nome.replace(/Comissão (De|Do)/g, ''));

      comissoes.unshift({
        idComissaoVoz: this.FILTRO_PADRAO_COMISSAO_VALUE,
        sigla: this.FILTRO_PADRAO_COMISSAO,
        nome: this.FILTRO_PADRAO_COMISSAO
      });

      this.comissoes = comissoes;
    });
  }

  getLiderancas(casa: string): void {
    this.liderancaService.getLiderancas(casa).pipe(takeUntil(this.unsubscribe)).subscribe((liderancas) => {
      this.liderancas = liderancas;
      this.liderancas.unshift({ cargo: this.FILTRO_PADRAO_LIDERANCA });
    });
  }

  getCargosComissao(casa: string): void {
    this.comissaoService.getCargos(casa).pipe(takeUntil(this.unsubscribe)).subscribe((cargos) => {
      this.cargosComissao = cargos;
      this.cargosComissao.unshift({ cargo: this.FILTRO_PADRAO_CARGO_COMISSAO });
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
    this.aplicarFiltro();
  }

  getTemaById(id: number) {
    if (this.temas && id !== this.FILTRO_PADRAO_TEMA) {
      return this.temas.filter(tema => tema.idTema === id)[0].tema;
    }
  }

  isFiltroDefault() {
    return ((this.filtro.nome === '' || typeof this.filtro.nome === 'undefined') &&
      this.filtro.estado === this.FILTRO_PADRAO_ESTADO &&
      this.filtro.partido === this.FILTRO_PADRAO_PARTIDO &&
      this.filtro.tema === this.FILTRO_PADRAO_TEMA &&
      this.filtro.comissao === this.FILTRO_PADRAO_COMISSAO &&
      this.filtro.lideranca === this.FILTRO_PADRAO_LIDERANCA &&
      this.filtro.cargoComissao === this.FILTRO_PADRAO_CARGO_COMISSAO);
  }

  getComissaoById(id: string) {
    if (this.comissoes && id !== this.FILTRO_PADRAO_COMISSAO_VALUE) {
      const comissao = this.comissoes.filter(com => com.idComissaoVoz === id);
      if (comissao !== undefined && comissao.length > 0) {
        return comissao[0].sigla;
      }
    }
  }

  getNomeComissaoById(id: string) {
    if (this.comissoes && id !== this.FILTRO_PADRAO_COMISSAO_VALUE) {
      const comissao = this.comissoes.filter(com => com.idComissaoVoz === id);
      if (comissao !== undefined && comissao.length > 0) {
        return comissao[0].nome;
      }
    }
  }

  private updateUrlFiltro(filtro: any) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (filtro.tema !== this.FILTRO_PADRAO_TEMA) {
      queryParams.tema = filtro.tema;
    } else {
      delete queryParams.tema;
    }

    if (filtro.nome !== '' && filtro.nome !== undefined) {
      queryParams.nome = filtro.nome;
    } else {
      delete queryParams.nome;
    }

    if (filtro.estado !== this.FILTRO_PADRAO_ESTADO) {
      queryParams.estado = filtro.estado;
    } else {
      delete queryParams.estado;
    }

    if (filtro.partido !== this.FILTRO_PADRAO_PARTIDO) {
      queryParams.partido = filtro.partido;
    } else {
      delete queryParams.partido;
    }

    if (filtro.comissao !== this.FILTRO_PADRAO_COMISSAO_VALUE) {
      queryParams.comissao = filtro.comissao;
    } else {
      delete queryParams.comissao;
    }

    if (filtro.lideranca !== this.FILTRO_PADRAO_LIDERANCA) {
      queryParams.lideranca = filtro.lideranca;
    } else {
      delete queryParams.lideranca;
    }

    if (filtro.cargoComissao !== this.FILTRO_PADRAO_CARGO_COMISSAO) {
      queryParams.cargoComissao = filtro.cargoComissao;
    } else {
      delete queryParams.cargoComissao;
    }

    this.router.navigate([], { queryParams });
  }

  private updateFiltroViaUrl() {
    this.activatedRoute.queryParams.subscribe(
      params => {
        let filtroPresente = false;
        Object.keys(params).forEach(value => {
          if (value === 'tema') {
            this.temaSelecionado = Number(params[value]);
            filtroPresente = true;
          }
          if (value === 'nome') {
            this.nomePesquisado = params[value];
            filtroPresente = true;
          }
          if (value === 'estado') {
            this.estadoSelecionado = params[value];
            filtroPresente = true;
          }
          if (value === 'partido') {
            this.partidoSelecionado = params[value];
            filtroPresente = true;
          }
          if (value === 'comissao') {
            this.comissaoSelecionada = params[value];
            filtroPresente = true;
          }
          if (value === 'lideranca') {
            this.liderancaSelecionada = params[value];
            filtroPresente = true;
          }
          if (value === 'cargoComissao') {
            this.cargoComissaoSelecionado = params[value];
            filtroPresente = true;
          }
        });

        if (filtroPresente) {
          this.aplicarFiltro();
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
