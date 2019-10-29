import { Partido } from './partido.model';

export interface ParlamentarInvestimento {
  totalReceitaPartido: number;
  totalReceitaCandidato: number;
  indiceInvestimentoPartido: number;
  partidoAtual: Partido;
  partidoEleicao: Partido;
}
