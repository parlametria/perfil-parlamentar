import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges
} from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  AnimationEvent
} from "@angular/animations";

import { Parlamentar } from "src/app/shared/models/parlamentar.model";

@Component({
  selector: "app-card-parlamentar",
  templateUrl: "./card-parlamentar.component.html",
  styleUrls: ["./card-parlamentar.component.scss"],
  animations: [
    trigger("openClose", [
      state(
        "open",
        style({
          height: "*",
          opacity: 1
        })
      ),
      state(
        "closed",
        style({
          height: "0px",
          opacity: 0
        })
      ),
      transition("open => closed", [animate("0.25s")]),
      transition("closed => open", [animate("0.25s 0.3s")])
    ]),
    trigger("show", [
      state(
        "show",
        style({
          opacity: 1
        })
      ),
      state(
        "hide",
        style({
          opacity: 0
        })
      ),
      transition("show => hide", [animate("0.25s")]),
      transition("hide => show", [animate("0.25s 0.3s")])
    ])
  ]
})
export class CardParlamentarComponent implements OnChanges, OnInit {
  readonly VIEW_SM = "sm";
  readonly VIEW_MD = "md";
  readonly VIEW_LG = "lg";

  @Input() id: number;
  @Input() parlamentar: Parlamentar;
  @Input() tema: number;
  @Input() view: any;
  @Output() followChecked = new EventEmitter<boolean>();

  readonly FILTRO_PADRAO_TEMA = -1;

  alinhamento: any;
  following: boolean = false;
  isCollapsed: boolean;

  constructor() {
    this.view = this.VIEW_MD;
    this.isCollapsed = false;
  }

  ngOnInit() {
    if (this.tema === null) {
      this.setAlinhamento(this.FILTRO_PADRAO_TEMA);
    }
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

  getMaiorQuantidadePerguntas() {
    if (typeof(this.alinhamento.temas) !== 'undefined') {
      const max = this.alinhamento.temas.reduce(
        (max, p) => (p.totalPerguntas > max ? p.totalPerguntas : max),
        this.alinhamento.temas[0].totalPerguntas
      );

      return max > 0 ? 100 / max : 0;
    }
    return 0;
  }

  onAnimationStart(event: AnimationEvent) {
    if (event.toState == "closed") {
      this.isCollapsed = true;
    }
  }

  onAnimationEnd(event: AnimationEvent) {
    if (event.toState == "open") {
      this.isCollapsed = false;
    } else {
      this.isCollapsed = true;
    }
  }
}
