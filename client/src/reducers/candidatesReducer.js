import { SET_CANDIDATE_SCORE } from "../actions/types";

const QUESTIONS_SIZE = 50; // Deve ser substituído por um perguntas.size() depois, quando tivermos acesso às perguntas.
const CANDIDATES_SIZE = 8000;

// candidatesVotings: {id_votacao: voto}
// arrayVotings: [0/1/-1]
// O estado inicial será definido a partir do banco de dados, uma chamada para preencher esses arrays e objetos.
const initialState = {
  candidatesVotings: [].fill.call(
    { length: CANDIDATES_SIZE },
    Array(QUESTIONS_SIZE).fill(0)
  )
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CANDIDATE_SCORE:
      return {
        ...state,
        candidatesScore: action.candidatesScore
      };
    default:
      return state;
  }
}
