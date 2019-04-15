export class Parlamentar {

  public idParlamentar: string;
  public cpf: string;
  public estado: string;
  public uf: string;
  public nomeUrna: string;
  public recebeu: boolean;
  public respondeu: boolean;
  public eleito: boolean;
  public reeleicao: string;
  public email: string;
  public sgPartido: string;
  public partido: string;
  public genero: string;
  public votacoes: any;
  public alinhamento?: any;

  constructor(parlamentar: any) {
    this.idParlamentar = parlamentar.id_parlamentar;
    this.cpf = parlamentar.cpf;
    this.estado = parlamentar.estado;
    this.uf = parlamentar.uf;
    this.nomeUrna = parlamentar.nome_urna;
    this.recebeu = parlamentar.recebeu;
    this.respondeu = parlamentar.respondeu;
    this.eleito = parlamentar.eleito;
    this.reeleicao = parlamentar.reeleicao;
    this.email = parlamentar.email;
    this.sgPartido = parlamentar.sg_partido;
    this.partido = parlamentar.partido;
    this.genero = parlamentar.genero;
    this.votacoes = parlamentar.votacoes;
    this.alinhamento = parlamentar.alinhamento;
  }

  getFoto(): string {
    return 'https://www.camara.leg.br/internet/deputado/bandep/' + this.idParlamentar + '.jpg';
  }
}
