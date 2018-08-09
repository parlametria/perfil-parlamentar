import { SET_SCORE_CANDIDATO } from "../actions/types";

const TAM_PERGUNTAS = 50; // Deve ser substituído por um perguntas.size() depois, quando tivermos acesso às perguntas.
const TAM_CANDIDATOS = 8000;

// candidatesVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
// O estado inicial será definido a partir do banco de dados, uma chamada para preencher esses arrays e objetos.
const initialState = {
  respostasCandidatos: [].fill.call(
    { length: TAM_CANDIDATOS },
    Array(TAM_PERGUNTAS).fill(0)
  )
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SCORE_CANDIDATO:
      return {
        ...state,
        scoreCandidatos: action.scoreCandidatos
      };
    default:
      return state;
  }
}
