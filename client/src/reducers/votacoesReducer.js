import {
  VOTACOES_CARREGANDO,
  SET_DADOS_VOTACOES,
  SET_INDEX_VOTACAO
} from "../actions/types";

const initialState = {
  dadosVotacoes: {},
  isCarregando: false,
  TAM_PERGUNTAS: 0,
  indexPergunta: 0,
  votacoesCandidatos: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case VOTACOES_CARREGANDO:
      return {
        ...state,
        isCarregando: true
      };
    case SET_DADOS_VOTACOES:
      return {
        ...state,
        dadosVotacoes: action.dadosVotacoes,
        TAM_PERGUNTAS: action.TAM_PERGUNTAS,
        isCarregando: false
      };
    case SET_INDEX_VOTACAO:
      return {
        ...state,
        indexPergunta: action.indexPergunta
      };
    case SET_VOTACOES_CANDIDATOS:
      return {
        ...state,
        votacoesCandidatos: action.votacoesCandidatos,
        isCarregando: false
      };
    default:
      return state;
  }
}
