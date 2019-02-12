import { Tema } from './tema.model';

export class Pergunta {

  constructor(
    public id: number,
    public texto: number,
    public tema_perg: Tema,
  ) {}
}