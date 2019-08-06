import { Tema } from './tema.model';

export interface Proposicao {
  projetoLei: string;
  idProposicao: number;
  titulo: string;
  descricao: string;
  temas: Tema[];
  proposicaoVotacoes: any[];
}
