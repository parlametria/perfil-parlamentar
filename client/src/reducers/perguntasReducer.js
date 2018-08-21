import { PERGUNTAS_CARREGANDO, SET_DADOS_PERGUNTAS } from "../actions/types";

const initialState = {
  dadosPerguntas: {},
  isCarregando: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PERGUNTAS_CARREGANDO:
      return {
        ...state,
        isCarregando: true
      };
    case SET_DADOS_PERGUNTAS:
      return {
        ...state,
        dadosPerguntas: action.dadosPerguntas,
        isCarregando: false
      };
    default:
      return state;
  }
}
