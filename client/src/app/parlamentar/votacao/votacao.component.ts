import { Component, OnInit, Input } from '@angular/core';

import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { ParlamentarVotos } from 'src/app/shared/models/parlamentarVotos.model';
import { Orientacao } from 'src/app/shared/models/orientacao.model';

@Component({
  selector: 'app-votacao',
  templateUrl: './votacao.component.html',
  styleUrls: ['./votacao.component.scss']
})
export class VotacaoComponent implements OnInit {
  readonly SIM = 1;
  readonly NAO = -1;
  readonly FALTOU = 0;
  readonly OBSTRUCAO = 2;
  readonly LIBEROU = 5;

  @Input() proposicao: Proposicao;
  @Input() parlamentar: ParlamentarVotos;
  @Input() orientacao: Orientacao;

  isCollapsed: boolean;

  constructor() { }

  ngOnInit() {
    this.isCollapsed = true;
  }

  getClass(voto: number): string[] {
    const classes = ['voto'];
    switch (voto) {
      case this.SIM:
        classes.push('voto-sim');
        break;
      case this.NAO:
        classes.push('voto-nao');
        break;
      case this.FALTOU:
        classes.push('voto-faltou');
        break;
      case this.OBSTRUCAO:
        classes.push('voto-obstrucao');
        break;
      case this.LIBEROU:
        classes.push('voto-liberou');
        break;
      case undefined:
        classes.push('voto-liberou');
        break;
      default:
        break;
    }
    return classes;
  }

  getClassComparado(votoA: number, votoB: number): string[] {
    const classes = ['voto'];
    if (votoA === this.FALTOU) {
      classes.push('voto-faltou');
    } else if (votoB === this.LIBEROU || votoB === undefined) {
      classes.push('voto-liberou');
    } else if (votoA !== undefined && votoA === votoB) {
      classes.push('voto-sim');
    } else if (votoA !== undefined && votoB !== undefined && votoA !== votoB) {
      classes.push('voto-nao');
    } else {
      classes.push('voto-faltou');
    }
    return classes;
  }

}
