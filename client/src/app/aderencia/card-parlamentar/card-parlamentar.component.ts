import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from '@angular/animations';

import { ParlamentarAderencia } from 'src/app/shared/models/parlamentarAderencia.model';
import { getClassCargo } from 'src/app/shared/functions/comissao';

@Component({
  selector: 'app-card-parlamentar',
  templateUrl: './card-parlamentar.component.html',
  styleUrls: ['./card-parlamentar.component.scss'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '*',
          opacity: 1
        })
      ),
      state(
        'closed',
        style({
          height: '0px',
          opacity: 0
        })
      ),
      transition('open => closed', [animate('0.25s')]),
      transition('closed => open', [animate('0.25s 0.3s')])
    ]),
    trigger('show', [
      state(
        'show',
        style({
          opacity: 1
        })
      ),
      state(
        'hide',
        style({
          opacity: 0
        })
      ),
      transition('show => hide', [animate('0.25s')]),
      transition('hide => show', [animate('0.25s 0.3s')])
    ])
  ]
})
export class CardParlamentarComponent implements OnChanges, OnInit {
  readonly VIEW_SM = 'sm';
  readonly VIEW_MD = 'md';
  readonly VIEW_LG = 'lg';
  readonly PADRAO_COMISSAO = '-1';
  readonly MENSAGEM_SEM_ADERENCIA = 'Não há votações suficientes para calcular a aderência';

  @Input() id: number;
  @Input() parlamentar: ParlamentarAderencia;
  @Input() tema: number;
  @Input() temaSlug: string;
  @Input() comissao: string;
  @Input() view: any;
  @Output() followChecked = new EventEmitter<boolean>();

  readonly FILTRO_PADRAO_TEMA = 99;
  readonly FILTRO_PADRAO_ORIENTADOR = 'Governo';

  aderencia: any;
  aderenciasTemas: any;
  passo: number;
  following = false;
  isCollapsed: boolean;

  classeCargoComissao: string;

  constructor() {
    this.view = this.VIEW_LG;
    this.isCollapsed = false;
  }

  ngOnInit() {
    this.setAderenciaTemas();
    if (this.tema === null) {
      this.setAderencia(-1);
    }
    this.passo = this.getMaiorQuantidadeVotacoes(this.aderenciasTemas);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tema !== undefined && changes.tema.currentValue !== null) {
      this.setAderencia(changes.tema.currentValue);
    }
    if (changes.comissao !== undefined && changes.comissao.currentValue !== null) {
      this.setClasseCargoComissao();
    }
  }

  toggleFollow() {
    this.following = !this.following;
    this.followChecked.emit(this.following);
  }

  setAderencia(tema: number) {
    if (tema !== -1) {
      this.aderencia = this.parlamentar.aderencia.filter(
        res => (res.aderenciaTema.idTema === tema && res.partido.sigla === this.FILTRO_PADRAO_ORIENTADOR)
      )[0];
    } else {
      this.aderencia = this.parlamentar.aderencia.filter(
        res => (res.aderenciaTema.idTema === this.FILTRO_PADRAO_TEMA && res.partido.sigla === this.FILTRO_PADRAO_ORIENTADOR)
      )[0];
    }
  }

  setAderenciaTemas() {
    this.aderenciasTemas = this.parlamentar.aderencia.filter(
      res => (res.partido.sigla === this.FILTRO_PADRAO_ORIENTADOR)
    );
  }

  getMaiorQuantidadeVotacoes(aderencia: any): number {
    const a = aderencia.filter(
      res => (res.aderenciaTema.idTema === this.FILTRO_PADRAO_TEMA)
    )[0];
    if (a !== undefined) {
      const max = a.seguiu + a.naoSeguiu + a.partidoLiberou + a.faltou;
      return max > 0 ? 100 / max : 0;
    }
    return 0;
  }

  getCargoByComissaoId(id: string) {
    const comissaoFiltrada = this.parlamentar.comissoes.filter(com => com.idComissaoVoz === id);

    if (comissaoFiltrada !== undefined && comissaoFiltrada.length > 0) {
      return comissaoFiltrada[0].cargo;
    } else {
      return '';
    }

  }

  // Define a classe que será aplicada ao badge que indica o cargo do parlamentar na comissao
  setClasseCargoComissao() {
    const cargo = this.getCargoByComissaoId(this.comissao);
    this.classeCargoComissao = getClassCargo(cargo);
  }

  onAnimationStart(event: AnimationEvent) {
    if (event.toState === 'closed') {
      this.isCollapsed = true;
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    if (event.toState === 'open') {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }

  getClassAderencia(aderencia: any) {
    if (aderencia === undefined) {
      return 'alinhamento-indefinido';
    }
    if (aderencia.aderencia >= 0.8) {
      return 'alinhamento-5';
    } else if (aderencia.aderencia >= 0.6) {
      return 'alinhamento-4';
    } else if (aderencia.aderencia >= 0.5) {
      return 'alinhamento-3';
    } else if (aderencia.aderencia >= 0.3) {
      return 'alinhamento-2';
    } else {
      return 'alinhamento-1';
    }
  }

}
