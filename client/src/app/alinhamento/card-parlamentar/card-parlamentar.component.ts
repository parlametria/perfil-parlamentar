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

import { Parlamentar } from 'src/app/shared/models/parlamentar.model';
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
  readonly MENSAGEM_SEM_ALINHAMENTO = 'Não existem respostas suficientes para o cálculo do alinhamento';

  @Input() id: number;
  @Input() parlamentar: Parlamentar;
  @Input() tema: number;
  @Input() temaSlug: string;
  @Input() comissao: string;
  @Input() view: any;
  @Output() followChecked = new EventEmitter<boolean>();

  readonly FILTRO_PADRAO_TEMA = -1;

  alinhamento: any;
  passo: number;
  following = false;
  isCollapsed: boolean;

  classeCargoComissao: string;

  constructor() {
    this.view = this.VIEW_MD;
    this.isCollapsed = false;
  }

  ngOnInit() {
    if (this.tema === null) {
      this.setAlinhamento(this.FILTRO_PADRAO_TEMA);
    }
    this.passo = this.getMaiorQuantidadePerguntas(this.parlamentar.alinhamento);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tema !== undefined && changes.tema.currentValue !== null) {
      this.setAlinhamento(changes.tema.currentValue);
    }
    if (changes.comissao !== undefined && changes.comissao.currentValue !== null) {
      this.setClasseCargoComissao();
    }
  }

  toggleFollow() {
    this.following = !this.following;
    this.followChecked.emit(this.following);
  }

  setAlinhamento(tema: number) {
    if (tema !== undefined && tema !== this.FILTRO_PADRAO_TEMA) {
      this.alinhamento = this.parlamentar.alinhamento.temas.filter(
        res => res.tema_id === tema
      )[0];
    } else {
      this.alinhamento = this.parlamentar.alinhamento;
    }
  }

  getMaiorQuantidadePerguntas(alinhamento: any): number {
    const maximo = alinhamento.temas.reduce(
      (max, p) => (p.totalPerguntas > max ? p.totalPerguntas : max),
      alinhamento.temas[0].totalPerguntas
    );
    return maximo > 0 ? 100 / maximo : 0;
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

  getClassAlinhamento() {
    if (this.alinhamento.perguntasIguais < 3) {
      return 'alinhamento-indefinido';
    } else {
      if (this.alinhamento.alinhamento >= 0.8) {
        return 'alinhamento-5';
      } else if (this.alinhamento.alinhamento >= 0.6) {
        return 'alinhamento-4';
      } else if (this.alinhamento.alinhamento >= 0.5) {
        return 'alinhamento-3';
      } else if (this.alinhamento.alinhamento >= 0.3) {
        return 'alinhamento-2';
      } else {
        return 'alinhamento-1';
      }
    }
  }

}
