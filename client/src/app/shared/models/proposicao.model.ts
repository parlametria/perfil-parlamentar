export class Proposicao {

  constructor(
    public projeto_lei: string,
    public id_votacao: number,
    public titulo: string,
    public descricao: string,
    public tema_id: number
  ) {}
}