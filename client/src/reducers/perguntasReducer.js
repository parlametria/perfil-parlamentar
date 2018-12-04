import {
  PERGUNTAS_CARREGANDO,
  SET_DADOS_PERGUNTAS,
  SET_INDEX_PERGUNTA
} from "../actions/types";

const initialState = {
  dadosPerguntas: {},
  TAM_PERGUNTAS: 0,
  isCarregando: false,
  indexPergunta: 0
};

export default function (state = initialState, action) {
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
        TAM_PERGUNTAS: action.TAM_PERGUNTAS,
        isCarregando: false
      };
    case SET_INDEX_PERGUNTA:
      return {
        ...state,
        indexPergunta: action.indexPergunta
      };

    default:
      return state;
  }
}
