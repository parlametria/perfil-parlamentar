import {
  SET_TEMA,
  SET_VAMOS_COMECAR,
  ESCONDE_PERGUNTAS,
  EXIBE_PERGUNTAS,
  SET_CONTINUAR_RESPONDENDO,
  SET_ABA_ATIVA
} from "../actions/types";

const initialState = {
  filtroTema: "Meio Ambiente",
  isVamosComecar: false,
  isExibeGavetaPerguntas: true,
  isContinuarRespondendo: false,
  abaAtiva: "Voz Ativa"
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
    case SET_CONTINUAR_RESPONDENDO:
      return {
        ...state,
        isContinuarRespondendo: true
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
