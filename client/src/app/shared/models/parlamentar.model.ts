export class Parlamentar {

  constructor(
    public cpf: string,
    public estado: number,
    public uf: string,
    public nome_urna: string,
    public recebeu: boolean,
    public respondeu: boolean,
    public eleito: boolean,
    public reeleicao: string,
    public email: string,
    public sg_partido: string,
    public partido: string,
    public votacoes: any
  ) {}
}