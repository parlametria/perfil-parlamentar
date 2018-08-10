import {
  SET_SCORE_CANDIDATO,
  CANDIDATOS_CARREGANDO,
  CANDIDATOS_CARREGADOS
} from "../actions/types";

// candidatesVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
// O estado inicial será definido a partir do banco de dados, uma chamada para preencher esses arrays e objetos.
const initialState = {
  dadosCandidatos: {},
  dbStatus: {},
  scoreCandidatos: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_CANDIDATO:
      return {
        ...state,
        scoreCandidatos: action.scoreCandidatos
      };
    case CANDIDATOS_CARREGANDO:
      return {
        ...state,
        dbStatus: { carregando: true }
      };
    case CANDIDATOS_CARREGADOS:
      return {
        ...state,
        dbStatus: { carregando: false }
      };
    default:
      return state;
  }
}
