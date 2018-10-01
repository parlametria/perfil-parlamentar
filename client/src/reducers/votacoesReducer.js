import { VOTACOES_CARREGANDO, SET_DADOS_VOTACOES } from "../actions/types";

const initialState = {
  dadosVotacoes: {},
  isCarregando: false
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
    default:
      return state;
  }
}
