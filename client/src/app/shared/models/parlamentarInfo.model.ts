import { Partido } from './partido.model';

export class ParlamentarInfo {

  public idParlamentarVoz: string;
  public idParlamentar: string;
  public casa: string;
  public nomeEleitoral: string;
  public uf: string;
  public parlamentarPartido: Partido;
  public emExercicio: boolean;
  public idPerfilPolitico: string;

  constructor(parlamentar: any) {
    this.idParlamentarVoz = parlamentar.id_parlamentar_voz;
    this.idParlamentar = parlamentar.id_parlamentar;
    this.casa = parlamentar.casa;
    this.nomeEleitoral = parlamentar.nome_eleitoral;
    this.uf = parlamentar.uf;
    this.parlamentarPartido = parlamentar.parlamentarPartido;
    this.emExercicio = parlamentar.em_exercicio;
    this.idPerfilPolitico = parlamentar.id_perfil_politico;
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
