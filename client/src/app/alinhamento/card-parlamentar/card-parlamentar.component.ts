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
    const comissaoFiltrada = this.parlamentar.comissoes.filter(com => com.id_comissao_voz === id);

    if (comissaoFiltrada !== undefined && comissaoFiltrada.length > 0) {
      return comissaoFiltrada[0].cargo;
    } else {
      return '';
    }

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
}
