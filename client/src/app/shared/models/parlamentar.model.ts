export class Parlamentar {

  public id_parlamentar: string;
  public cpf: string;
  public estado: number;
  public uf: string;
  public nome_urna: string;
  public recebeu: boolean;
  public respondeu: boolean;
  public eleito: boolean;
  public reeleicao: string;
  public email: string;
  public sg_partido: string;
  public partido: string;
  public votacoes: any;
  public alinhamento?: any;

  constructor(parlamentar: any) {
    this.id_parlamentar = parlamentar.id_parlamentar; 
    this.cpf = parlamentar.cpf;
    this.estado = parlamentar.estado;
    this.uf = parlamentar.uf;
    this.nome_urna = parlamentar.nome_urna;
    this.recebeu = parlamentar.recebeu;
    this.respondeu = parlamentar.respondeu;
    this.eleito = parlamentar.eleito;
    this.reeleicao = parlamentar.reeleicao;
    this.email = parlamentar.email;
    this.sg_partido = parlamentar.sg_partido;
    this.partido = parlamentar.partido;
    this.votacoes = parlamentar.votacoes;
    this.alinhamento = parlamentar.alinhamento;
  }

  getFoto(): string {
    return "https://www.camara.leg.br/internet/deputado/bandep/" + this.id_parlamentar + ".jpg";
  }
}