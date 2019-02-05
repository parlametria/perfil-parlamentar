import {
  SET_TEMA,
  SET_VAMOS_COMECAR,
  ESCONDE_PERGUNTAS,
  EXIBE_PERGUNTAS,
  SET_CONTINUAR_RESPONDENDO_TODOS,
  SET_CONTINUAR_RESPONDENDO_VOTACOES,
  SET_CONTINUAR_RESPONDENDO_VOZATIVA,
  SET_ABA_ATIVA
} from "../actions/types";

const initialState = {
  filtroTema: "Meio Ambiente",
  isVamosComecar: false,
  isExibeGavetaPerguntas: true,
  isContinuarRespondendo: { todos: false, votacoes: false, vozAtiva: false },
  abaAtiva: "Votacoes"
};

export default function (state = initialState, action) {
  switch (action.type) {
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
    case SET_CONTINUAR_RESPONDENDO_TODOS:
      return {
        ...state,
        isContinuarRespondendo: { todos: true, votacoes: state.isContinuarRespondendo.votacoes, vozAtiva: state.isContinuarRespondendo.vozAtiva }
      };
    case SET_CONTINUAR_RESPONDENDO_VOTACOES:
      return {
        ...state,
        isContinuarRespondendo: { todos: state.isContinuarRespondendo.todos, votacoes: true, vozAtiva: state.isContinuarRespondendo.vozAtiva }
      };
    case SET_CONTINUAR_RESPONDENDO_VOZATIVA:
      return {
        ...state,
        isContinuarRespondendo: { todos: state.isContinuarRespondendo.todos, votacoes: state.isContinuarRespondendo.votacoes, vozAtiva: true }
      };
    case SET_ABA_ATIVA:
      return {
        ...state,
        abaAtiva: action.abaAtiva
      };
    default:
      return state;
  }
}
