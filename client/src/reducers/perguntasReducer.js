import {
  PERGUNTAS_CARREGANDO,
  SET_DADOS_PERGUNTAS,
  SET_INDEX_PERGUNTA
} from "../actions/types";

const initialState = {
  dadosPerguntas: {},
  isCarregando: false,
  perguntaAtual: 0
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
    case SET_INDEX_PERGUNTA:
      return {
        ...state,
        perguntaAtual: action.newIndex
      };
    default:
      return state;
  }
}
