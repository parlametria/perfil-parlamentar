import { Partido } from './partido.model';
import { ComposicaoComissao } from './composicaoComissao.model';
import { AderenciaDados } from './aderencia.model';
import { Lideranca } from './lideranca.model';

export class ParlamentarAderencia {

  public idParlamentarVoz: string;
  public idParlamentar: string;
  public nomeEleitoral: string;
  public uf: string;
  public emExercicio: boolean;
  public aderencia?: AderenciaDados[];
  public comissoes?: ComposicaoComissao[];
  public parlamentarLiderancas?: Lideranca[];
  public parlamentarPartido: Partido;
  public casa: string;
  public nomeProcessado: string;

  constructor(parlamentar: any) {
    this.idParlamentarVoz = parlamentar.idParlamentarVoz;
    this.idParlamentar = parlamentar.idParlamentar;
    this.nomeEleitoral = parlamentar.nomeEleitoral;
    this.uf = parlamentar.uf;
    this.emExercicio = parlamentar.emExercicio;
    this.aderencia = parlamentar.parlamentarAderencia;
    this.comissoes = parlamentar.parlamentarComissoes;
    this.parlamentarPartido = parlamentar.parlamentarPartido;
    this.parlamentarLiderancas = parlamentar.parlamentarLiderancas;
    this.casa = parlamentar.casa;
    this.nomeProcessado = parlamentar.nomeProcessado;
  }

  getFoto(): string {
    if (this.casa === 'camara') {
      return 'https://www.camara.leg.br/internet/deputado/bandep/' + this.idParlamentar + '.jpg';
    } else if (this.casa === 'senado') {
      return 'https://www.senado.leg.br/senadores/img/fotos-oficiais/senador' + this.idParlamentar + '.jpg';
    }
    return '';
  }
}
