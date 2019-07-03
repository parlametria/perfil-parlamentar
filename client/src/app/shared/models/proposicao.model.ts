import { Tema } from './tema.model';

export interface Proposicao {
  projeto_lei: string;
  id_proposicao: number;
  titulo: string;
  descricao: string;
  temas: Tema[];
  proposicaoVotacoes: any[];
}
