import {
  PERGUNTAS_CARREGANDO,
  SET_DADOS_PERGUNTAS,
  SET_INDEX_PERGUNTA,
  SET_TEMA
} from "../actions/types";

const initialState = {
  dadosPerguntas: {},
  isCarregando: false,
  indexPergunta: 0,
  filtroTema: "Meio Ambiente"
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
        indexPergunta: action.indexPergunta
      };
    case SET_TEMA:
      return {
        ...state,
        filtroTema: action.tema
      };
    default:
      return state;
  }
}
