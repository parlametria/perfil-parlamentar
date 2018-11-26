import {
  VOTACOES_CARREGANDO,
  SET_DADOS_VOTACOES,
  SET_VOTACOES_CANDIDATOS
} from "../actions/types";

const initialState = {
  dadosVotacoes: {},
  isCarregando: false,
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
        isCarregando: false
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
