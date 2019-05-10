export class Parlamentar {

  public idParlamentarVoz: string;
  public idParlamentar: string;
  public casa: string;
  public nomeEleitoral: string;
  public uf: string;
  public partido: string;
  public genero: string;
  public emExercicio: boolean;
  public votacoes: any;
  public alinhamento?: any;
  public comissoes?: any;

  constructor(parlamentar: any) {
    this.idParlamentarVoz = parlamentar.id_parlamentar_voz;
    this.idParlamentar = parlamentar.id_parlamentar;
    this.casa = parlamentar.casa;
    this.nomeEleitoral = parlamentar.nome_eleitoral;
    this.uf = parlamentar.uf;
    this.partido = parlamentar.partido;
    this.genero = parlamentar.genero;
    this.emExercicio = parlamentar.em_exercicio;
    this.votacoes = parlamentar.parlamentar_vot;
    this.alinhamento = parlamentar.alinhamento;
    this.comissoes = parlamentar.parlamentar_comissoes;
  }

  getFoto(): string {
    return 'https://www.camara.leg.br/internet/deputado/bandep/' + this.idParlamentar + '.jpg';
  }
}
