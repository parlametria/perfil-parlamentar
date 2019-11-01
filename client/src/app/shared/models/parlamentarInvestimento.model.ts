import { Partido } from './partido.model';
import { PartidoInvestimento } from './partidoInvestimento.model';

interface DadosParlamentar {
  casa: string;
  nomeEleitoral: string;
  uf: string;
}

export interface ParlamentarInvestimento {
  totalReceitaPartido: number;
  totalReceitaCandidato: number;
  indiceInvestimentoPartido: number;
  partidoAtual: Partido;
  partidoEleicao: Partido;
  parlamentarInvestimento: DadosParlamentar;
  partidoInvestimento: PartidoInvestimento;
}
