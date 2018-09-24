import {
  PERGUNTAS_CARREGANDO,
  SET_DADOS_PERGUNTAS,
  SET_INDEX_PERGUNTA,
  SET_TEMA,
  SET_VAMOS_COMECAR,
  ESCONDE_PERGUNTAS,
  EXIBE_PERGUNTAS
} from "../actions/types";

const initialState = {
  dadosPerguntas: {},
  isCarregando: false,
  indexPergunta: 0,
  filtroTema: "Meio Ambiente",
  // Vamos começar
  isVamosComecar: false,
  isExibeGavetaPerguntas: true
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
    case SET_VAMOS_COMECAR:
      return {
        ...state,
        isVamosComecar: true
      };
    case EXIBE_PERGUNTAS:
      return {
        ...state,
        isExibeGavetaPerguntas: true
      };
    case ESCONDE_PERGUNTAS:
      return {
        ...state,
        isExibeGavetaPerguntas: false
      };
    default:
      return state;
  }
}
