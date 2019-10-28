import { Tema } from './tema.model';

export interface Proposicao {
  projetoLei: string;
  idProposicao: number;
  casa: string;
  titulo: string;
  descricao: string;
  temas: Tema[];
  proposicaoVotacoes: any[];
}
