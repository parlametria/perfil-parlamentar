import {
  SET_SCORE_CANDIDATOS,
  SET_SCORE_CANDIDATO_POR_TEMA,
  SET_DADOS_CANDIDATOS,
  SET_FILTRO_CANDIDATOS,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS,
  SET_NUM_RESPOSTAS,
  SET_DADOS_CANDIDATO
} from "../actions/types";

// candidatesVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
// O estado inicial será definido a partir do banco de dados, uma chamada para preencher esses arrays e objetos.
const initialState = {
  numResponderam : 0,
  numSemResposta : 0,
  dadosCandidatos: {},
  isCarregando: false,
  scoreCandidatos: {},
  filtro: { nome: "", partido: "TODOS", estado: "" },
  dadosCandidato: {},
  scoreTema: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_DADOS_CANDIDATOS:
      return {
        ...state,
        dadosCandidatos: action.dadosCandidatos,
        isCarregando: false
      };
    case SET_DADOS_CANDIDATO:
      return {
        ...state,
        dadosCandidato: action.dadosCandidato,
        isCarregando: false
      };
    case SET_SCORE_CANDIDATOS:
      return {
        ...state,
        scoreCandidatos: action.scoreCandidatos
      };
    case SET_SCORE_CANDIDATO_POR_TEMA:
      return {
        ...state,
        scoreTema: action.scoreTema
      };
    case CANDIDATOS_CARREGANDO:
      return {
        ...state,
        isCarregando: true
      };
    case CANDIDATOS_CARREGADOS:
      return {
        ...state,
        isCarregando: false
      };
    case SET_FILTRO_CANDIDATOS:
      return {
        ...state,
        filtro: action.filtro
      };
    case SET_NUM_RESPOSTAS:
    return {
      ...state,
      numResponderam: action.numResponderam,
      numSemResposta: action.numSemResposta,
    };
    default:
      return state;
  }
}
