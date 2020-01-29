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
  readonly ABSTENCAO = 3;
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
    return classes.concat(this.getVotacaoClass(voto));
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

  getVotacaoClass(voto: number): string[] {
    const classes = ['voto-lg'];
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
      case this.ABSTENCAO:
        classes.push('voto-abstencao');
        break;
      case undefined:
        classes.push('voto-liberou');
        break;
      case null:
        classes.push('voto-liberou');
        break;
      default:
        break;
    }
    return classes;
  }

  getTextoVoto(voto: number): string {
    let textoVoto: string;
    switch (voto) {
      case this.SIM:
        textoVoto = 'SIM';
        break;
      case this.NAO:
        textoVoto = 'NÃO';
        break;
      case this.FALTOU:
        textoVoto = 'FALTOU';
        break;
      case this.OBSTRUCAO:
        textoVoto = 'OBSTRUÇÃO';
        break;
      case this.LIBEROU:
        textoVoto = 'LIBEROU';
        break;
      case this.ABSTENCAO:
        textoVoto = 'ABSTENÇÃO';
        break;
      case undefined:
        textoVoto = 'LIBEROU';
        break;
      case null:
        textoVoto = 'LIBEROU';
        break;
      default:
        break;
    }
    return textoVoto;
  }

  getUrlProposicao(id: number, casa: string): string {
    const camaraUrl = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=';
    const senadoUrl = 'https://www25.senado.leg.br/web/atividade/materias/-/materia/';
    const str = id + '';

    let url;

    if (casa === 'camara') {
      url = camaraUrl;
    } else {
      url = senadoUrl;
    }

    return url + str.substring(1, str.length);
  }

}
